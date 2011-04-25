APP_NAME = my_app_name
APP_VERSION = my_version
APP_FULLNAME = $(APP_NAME)-$(APP_VERSION)
APP_DIR = /var/tmp/my_app_dir
BUILD_BASE = $(APP_DIR)/build
BUILD_LINT = $(BUILD_BASE)/lint
BUILD_PACKAGE = $(BUILD_BASE)/package
BUILD_TEST = $(BUILD_BASE)/test
DEPLOY_HOST = my_deploy_host
DEPLOY_PORT = 22
DEPLOY_DIR = /var/tmp/my_deploy_dir

dep:
	npm install nodelint vows
	sudo gem install json rb-appscript safariwatir
	
init:
	echo "B0b shall build."

clean: init
	rm -rf $(BUILD_BASE)
	rm -f $(APP_DIR)/nohup.*

lint: init
	mkdir -p $(BUILD_LINT)
	nodelint --config $(B0B_HOME)/conf/lint.js --reporter $(B0B_HOME)/conf/lintreporter.js $(BUILD_LINT_FILES) $(APP_DIR)/lib/ | tee $(BUILD_LINT)/jslint.xml

test-unit: init
	mkdir -p $(BUILD_TEST)
	vows test/unit/*

test-web: init
	ruby test/web/main.rb
    
package: init
	mkdir -p $(BUILD_PACKAGE)
	tar --exclude test -X $(B0B_HOME)/conf/packageexclude.txt -cvf $(BUILD_PACKAGE)/$(APP_FULLNAME).tar *
	gzip $(BUILD_PACKAGE)/$(APP_FULLNAME).tar

deploy: package
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); rm -rf *;'
	scp -P $(DEPLOY_PORT) $(BUILD_PACKAGE)/$(APP_FULLNAME).tar.gz $(DEPLOY_HOST):$(DEPLOY_DIR)
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

deploy-r: deploy
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) '$(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(DEPLOY_DIR) stop; $(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(DEPLOY_DIR) start prd;'

start-dev:
	$(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(APP_DIR) start dev
	
start-prd:
	$(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(APP_DIR) start prd

stop:
	$(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(APP_DIR) stop

restart-dev: stop start-dev

restart-prd: stop start-prd

status:
	$(B0B_HOME)/bin/ghibli.sh $(APP_NAME) $(APP_DIR) status
	
.PHONY: init clean dep-run dep-tool lint test-web start-dev start-prd stop status package deploy deploy-r
