APP_FULLNAME = $(APP_NAME)-$(APP_VERSION)
APP_LIB_DIR = lib
APP_SRC_DIR = .
APP_TEST_DIR = test
BUILD_BASE = $(APP_DIR)/build
BUILD_LINT = $(BUILD_BASE)/lint
BUILD_PACKAGE = $(BUILD_BASE)/package
BUILD_TEST = $(BUILD_BASE)/test

init:
	echo "Bob shall build."

clean: init
	rm -rf $(BUILD_BASE)
	rm -f $(APP_DIR)/nohup.*
	rm -f $(APP_DIR)/*.log

lint: init
	mkdir -p $(BUILD_LINT)
	nodelint --config $(BOB_DIR)/conf/lint.js --reporter $(BOB_DIR)/conf/lintreporter.js $(BUILD_LINT_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/ | tee $(BUILD_LINT)/jslint.xml

test: init
	mkdir -p $(BUILD_TEST)
	vows $(APP_TEST_DIR)/*
    
package: init
	mkdir -p $(BUILD_PACKAGE)
	tar --exclude $(APP_DIR)/$(APP_TEST_DIR) -X $(BOB_DIR)/conf/packageexclude.txt -C $(APP_DIR)/$(APP_SRC_DIR) -cvf $(BUILD_PACKAGE)/$(APP_FULLNAME).tar .
	gzip $(BUILD_PACKAGE)/$(APP_FULLNAME).tar

deploy: package
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); rm -rf *;'
	scp -P $(DEPLOY_PORT) $(BUILD_PACKAGE)/$(APP_FULLNAME).tar.gz $(DEPLOY_HOST):$(DEPLOY_DIR)
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); nohup sh -c "export NODE_ENV=$(NODE_ENV); node $(APP_NAME).js restart;" &;'

deploy-r: deploy remote-r
	
stop:
	nohup sh -c "export NODE_ENV=$(NODE_ENV); node $(APP_NAME).js stop;" &
	
start:
	nohup sh -c "export NODE_ENV=$(NODE_ENV); node $(APP_NAME).js start;" &
	
restart:
	nohup sh -c "export NODE_ENV=$(NODE_ENV); node $(APP_NAME).js restart;" &

status:
	nohup sh -c "export NODE_ENV=$(NODE_ENV); node $(APP_NAME).js status;" &

dep: init
	npm install .
	
tools: init
	npm install -g nodelint vows

.PHONY: init clean lint test package deploy remote-r deploy-r stop start start-prd restart restart-prd status dep tools