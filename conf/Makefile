FULLNAME = $(NAME)-$(VERSION)
BUILD_DIR = $(APP_DIR)/build
REPORT_DIR = $(BUILD_DIR)/report
ARTIFACT_DIR = $(BUILD_DIR)/artifact
RUN_DIR = $(APP_DIR)/run

exec_report =             \
	mkdir -p $1;      \
	$2 2>&1 | tee $3; \

init:
	@echo "Bob shall build."
	mkdir -p $(BUILD_DIR) $(RUN_DIR)/logs $(RUN_DIR)/pids

dep: 
	npm install .
	
tools: 
	npm install -g jscheckstyle jshint nodelint vows

clean:
	rm -rf $(BUILD_DIR) $(RUN_DIR) $(APP_DIR)/nohup.* $(APP_DIR)/*.log

checkstyle: init
	$(call exec_report, $(REPORT_DIR), jscheckstyle $(BOB_CHECKSTYLE_OPTS) $(BOB_CHECKSTYLE_FILES), $(REPORT_DIR)/checkstyle.out)

lint: init
	$(call exec_report, $(REPORT_DIR), nodelint $(BOB_LINT_OPTS) $(BOB_LINT_FILES), $(REPORT_DIR)/lint.out)

hint: init
	$(call exec_report, $(REPORT_DIR), jshint $(BOB_HINT_FILES) $(BOB_HINT_OPTS), $(REPORT_DIR)/hint.out)

test: init
	$(call exec_report, $(REPORT_DIR), vows $(BOB_TEST_FILES) $(BOB_TEST_OPTS), $(REPORT_DIR)/test.out)

coverage: init
	$(call exec_report, $(REPORT_DIR), vows $(BOB_COVERAGE_FILES) $(BOB_COVERAGE_OPTS), $(REPORT_DIR)/coverage.out)

package: init
	mkdir -p $(ARTIFACT_DIR)/$(FULLNAME)
	rsync -av $(BOB_SRC_DIR)/ $(ARTIFACT_DIR)/$(FULLNAME)
	cd $(ARTIFACT_DIR); tar -X $(BOB_DIR)/conf/packageexclude.txt -cvzf $(FULLNAME).tar.gz .
	
stop:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js stop
	
start:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js start
	
restart:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js restart

status:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js status

nuke:
	kill -9 `ps -ef | sed -n '/node'""'/{/grep/!p;}' | awk '{print $$2}'`

deploy: package
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); rm -rf *;'
	scp -P $(BOB_DEPLOY_PORT) $(ARTIFACT_DIR)/$(FULLNAME).tar.gz $(BOB_DEPLOY_HOST):$(BOB_DEPLOY_DIR)
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); NODE_ENV=$(NODE_ENV) node $(NAME).js restart;'

deploy-r: deploy remote-r
	
.PHONY: dep tools init clean checkstyle lint hint test coverage package stop start restart status nuke deploy remote-r deploy-r
