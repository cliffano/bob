APP_FULLNAME = $(NAME)-$(VERSION)
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
	$(call exec_report, $(BUILD_REPORT), jscheckstyle $(BOB_CHECKSTYLE_OPTS) $(BOB_CHECKSTYLE_FILES), $(BUILD_REPORT)/checkstyle.out)

lint: init
	$(call exec_report, $(BUILD_REPORT), nodelint $(BOB_LINT_OPTS) $(BOB_LINT_FILES), $(BUILD_REPORT})/lint.out)

hint: init
	$(call exec_report, $(BUILD_REPORT), jshint $(BOB_HINT_FILES) $(BOB_HINT_OPTS), $(BUILD_REPORT)/hint.out)

test: init
	$(call exec_report, $(BUILD_REPORT), vows $(BOB_TEST_FILES) $(BOB_TEST_OPTS), $(BUILD_REPORT)/test.out)

coverage: init
	$(call exec_report, $(BUILD_REPORT), vows $(BOB_COVERAGE_FILES) $(BOB_COVERAGE_OPTS), $(BUILD_REPORT)/coverage.out)

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
	
.PHONY: dep tools init clean checkstyle lint hint test coverage package stop start restart status nuke deploy remote-r deploy-r
