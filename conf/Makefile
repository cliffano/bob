APP_FULLNAME = $(NAME)-$(VERSION)
APP_LIB_DIR = lib
APP_TEST_DIR = test
BUILD_BASE = $(APP_DIR)/build
BUILD_REPORT = $(BUILD_BASE)/report
BUILD_ARTIFACT = $(BUILD_BASE)/artifact
RUN_BASE = $(APP_DIR)/run

exec_report =             \
	mkdir -p $1;      \
	$2 2>&1 | tee $3; \

init:
	echo "Bob shall build."

dep: init
	npm install .
	
tools: init
	npm install -g jscheckstyle jshint nodelint vows

clean: init
	rm -rf $(BUILD_BASE)
	rm -rf $(RUN_BASE)
	rm -f $(APP_DIR)/nohup.*
	rm -f $(APP_DIR)/*.log

checkstyle: init
	$(call exec_report, $(BUILD_REPORT), jscheckstyle $(BOB_CHECKSTYLE_OPTS) $(BOB_CHECKSTYLE_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/, $(BUILD_REPORT)/checkstyle.out)

lint: init
	$(call exec_report, $(BUILD_REPORT), nodelint $(BOB_LINT_OPTS) $(BOB_LINT_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/, $(BUILD_REPORT})/lint.out)

hint: init
	$(call exec_report, $(BUILD_REPORT), jshint $(BOB_HINT_FILES) $(APP_DIR)/$(APP_LIB_DIR)/ $(APP_DIR)/$(APP_TEST_DIR)/ $(BOB_HINT_OPTS), $(BUILD_REPORT)/hint.out)

test: init
	$(call exec_report, $(BUILD_REPORT), vows $(APP_TEST_DIR)/*.js $(BOB_TEST_OPTS), $(BUILD_REPORT)/test.out)
    
package: init
	mkdir -p $(BUILD_ARTIFACT)
	tar --exclude $(APP_DIR)/$(APP_TEST_DIR) -X $(BOB_DIR)/conf/packageexclude.txt -C $(APP_DIR)/$(BOB_SRC_DIR) -cvf $(BUILD_ARTIFACT)/$(APP_FULLNAME).tar .
	gzip $(BUILD_ARTIFACT)/$(APP_FULLNAME).tar

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
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); rm -rf *;'
	scp -P $(BOB_DEPLOY_PORT) $(BUILD_ARTIFACT)/$(APP_FULLNAME).tar.gz $(BOB_DEPLOY_HOST):$(BOB_DEPLOY_DIR)
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); NODE_ENV=$(NODE_ENV) node $(NAME).js restart;'

deploy-r: deploy remote-r
	
.PHONY: dep tools init clean lint hint test package stop start restart status nuke deploy remote-r deploy-r
