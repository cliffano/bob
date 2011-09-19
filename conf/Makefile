APP_FULLNAME = $(NAME)-$(VERSION)
APP_LIB_DIR = lib
APP_SRC_DIR = .
APP_TEST_DIR = test
BUILD_BASE = $(APP_DIR)/build
BUILD_HINT = $(BUILD_BASE)/hint
BUILD_LINT = $(BUILD_BASE)/lint
BUILD_PACKAGE = $(BUILD_BASE)/package
BUILD_TEST = $(BUILD_BASE)/test
RUN_BASE = $(APP_DIR)/run

exec_report =             \
	mkdir -p $1;      \
	$2 2>&1 | tee $3; \

init:
	echo "Bob shall build."

dep: init
	npm install .
	
tools: init
	npm install -g nodelint jshint vows

clean: init
	rm -rf $(BUILD_BASE)
	rm -rf $(RUN_BASE)
	rm -f $(APP_DIR)/nohup.*
	rm -f $(APP_DIR)/*.log

lint: init
	$(call exec_report, $(BUILD_LINT), nodelint $(BOB_LINT_OPTS) $(BOB_LINT_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/, $(BUILD_LINT)/lint.out)

hint: init
	$(call exec_report, $(BUILD_HINT), jshint $(BOB_HINT_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/ $(BOB_HINT_OPTS), $(BUILD_HINT)/hint.out)

test: init
	$(call exec_report, $(BUILD_TEST), vows $(APP_TEST_DIR)/*.js $(BOB_TEST_OPTS), $(BUILD_TEST)/test.out)
    
package: init
	mkdir -p $(BUILD_PACKAGE)
	tar --exclude $(APP_DIR)/$(APP_TEST_DIR) -X $(BOB_DIR)/conf/packageexclude.txt -C $(APP_DIR)/$(APP_SRC_DIR) -cvf $(BUILD_PACKAGE)/$(APP_FULLNAME).tar .
	gzip $(BUILD_PACKAGE)/$(APP_FULLNAME).tar

stop:
	NODE_ENV=$(NODE_ENV) node $(NAME).js stop
	
start:
	NODE_ENV=$(NODE_ENV) node $(NAME).js start
	
restart:
	NODE_ENV=$(NODE_ENV) node $(NAME).js restart

status:
	NODE_ENV=$(NODE_ENV) node $(NAME).js status

nuke:
	kill -9 `ps -ef | sed -n '/node'""'/{/grep/!p;}' | awk '{print $$2}'`

deploy: package
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); rm -rf *;'
	scp -P $(DEPLOY_PORT) $(BUILD_PACKAGE)/$(APP_FULLNAME).tar.gz $(DEPLOY_HOST):$(DEPLOY_DIR)
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); NODE_ENV=$(NODE_ENV) node $(NAME).js restart;'

deploy-r: deploy remote-r
	
.PHONY: dep tools init clean lint hint test package stop start restart status nuke deploy remote-r deploy-r
