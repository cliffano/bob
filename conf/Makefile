SHELL := /bin/bash
FULLNAME = $(NAME)-$(VERSION)
BUILD_DIR = $(APP_DIR)/build
REPORT_DIR = $(BUILD_DIR)/report
ARTIFACT_DIR = $(BUILD_DIR)/artifact
RUN_DIR = $(APP_DIR)/run

exec_report =             \
	mkdir -p $1;      \
	set -eo pipefail; \
	$2 2>&1 | tee $3; \

exec_sum =                                 \
	$1sum $2 | awk '{print $$1}' > $2.$1; \

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
	$(call exec_report,$(REPORT_DIR),nodelint $(BOB_LINT_OPTS) $(BOB_LINT_FILES),$(REPORT_DIR)/lint.out)

hint: init
	$(call exec_report,$(REPORT_DIR),jshint $(BOB_HINT_FILES) $(BOB_HINT_OPTS),$(REPORT_DIR)/hint.out)

test: init
	$(call exec_report,$(REPORT_DIR),vows $(BOB_TEST_FILES) $(BOB_TEST_OPTS),$(REPORT_DIR)/test.out)

test-npm:
	npm test

coverage: init
	$(call exec_report,$(REPORT_DIR),vows $(BOB_COVERAGE_FILES) $(BOB_COVERAGE_OPTS),$(REPORT_DIR)/coverage.out)

versionup:
	charlotte versionup

versionup-minor:
	charlotte versionup-minor
	
versionup-major:
	charlotte versionup-major

template:
	charlotte template
	
stop:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js stop
	
stop-npm:
	npm stop

start:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js start
	
start-npm:
	npm start

restart:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js restart

restart-npm:
	npm restart

status:
	NODE_ENV=$(NODE_ENV) node $(NAME)-app.js status

nuke:
	kill -9 `ps -ef | sed -n '/node'""'/{/grep/!p;}' | awk '{print $$2}'`

package: init
	mkdir -p $(ARTIFACT_DIR)/$(FULLNAME)
	rsync -av $(BOB_SRC_DIR)/ $(ARTIFACT_DIR)/$(FULLNAME)
	cd $(ARTIFACT_DIR); tar -X $(BOB_DIR)/conf/packageexclude.txt -cvzf $(FULLNAME).tar.gz $(FULLNAME)/
	rm -rf $(ARTIFACT_DIR)/$(FULLNAME)
	$(call exec_sum,md5,$(ARTIFACT_DIR)/$(FULLNAME).tar.gz)
	$(call exec_sum,sha1,$(ARTIFACT_DIR)/$(FULLNAME).tar.gz)

package-meta:
	cd $(BOB_PACKAGEMETA_DIR); cp $(BOB_PACKAGEMETA_FILE) $(ARTIFACT_DIR)/
	$(call exec_sum,md5,$(ARTIFACT_DIR)/$(BOB_PACKAGEMETA_FILE))
	$(call exec_sum,sha1,$(ARTIFACT_DIR)/$(BOB_PACKAGEMETA_FILE))

send: package
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'mkdir -p $(BOB_DEPLOY_DIR); cd $(BOB_DEPLOY_DIR); rm -rf *;'
	scp -i $(BOB_DEPLOY_KEY) -P $(BOB_DEPLOY_PORT) $(ARTIFACT_DIR)/* $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST):$(BOB_DEPLOY_DIR)

deploy: send
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); NODE_ENV=$(NODE_ENV) node $(NAME)-app.js restart;'

deploy-r: deploy remote-r
	
.PHONY: dep tools init clean checkstyle lint hint test coverage versionup versionup-minor versionup-major template stop start restart status nuke package package-meta send deploy remote-r deploy-r
