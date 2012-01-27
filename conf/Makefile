SHELL := /bin/bash
FULLNAME = $(NAME)-$(VERSION)
BUILD_DIR = $(APP_DIR)/build
REPORT_DIR = $(BUILD_DIR)/report
ARTIFACT_DIR = $(BUILD_DIR)/artifact
STAGE_DIR = $(BUILD_DIR)/stage
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
	npm install -g jscheckstyle jshint nodelint http://nodeload.github.com/cliffano/vows/tarball/master expresso

clean:
	rm -rf $(BUILD_DIR) $(RUN_DIR) $(APP_DIR)/nohup.* $(APP_DIR)/*.log

style: init
	$(call exec_report, $(REPORT_DIR), $(BOB_DIR)/node_modules/jscheckstyle/bin/jscheckstyle $(BOB_STYLE_OPTS) $(BOB_STYLE_FILES), $(REPORT_DIR)/style.out)

lintstrict: init
	$(call exec_report,$(REPORT_DIR),$(BOB_DIR)/node_modules/nodelint/nodelint $(BOB_LINTSTRICT_OPTS) $(BOB_LINTSTRICT_FILES),$(REPORT_DIR)/lintstrict.out)

lint: init
	$(call exec_report,$(REPORT_DIR),$(BOB_DIR)/node_modules/jshint/bin/hint $(BOB_LINT_FILES) $(BOB_LINT_OPTS),$(REPORT_DIR)/lint.out)

test: init
	$(call exec_report,$(REPORT_DIR),$(BOB_DIR)/node_modules/vows/bin/vows $(BOB_TEST_FILES) $(BOB_TEST_OPTS),$(REPORT_DIR)/test.out)

test-npm:
	npm test

coverage: init
	mkdir -p $(STAGE_DIR)
	node-jscoverage lib $(STAGE_DIR)/lib
	cp -r test $(STAGE_DIR)
	cp -r package.json $(STAGE_DIR)
	cp -r node_modules $(STAGE_DIR)
	cd $(STAGE_DIR); $(call exec_report,$(REPORT_DIR),$(BOB_DIR)/node_modules/vows/bin/vows $(BOB_COVERAGE_FILES) --silent --cover-html,$(REPORT_DIR)/coverage.out)
	cp $(STAGE_DIR)/coverage.html $(REPORT_DIR)
	cd $(STAGE_DIR); $(call exec_report,$(REPORT_DIR),$(BOB_DIR)/node_modules/vows/bin/vows $(BOB_COVERAGE_FILES) $(BOB_COVERAGE_OPTS),$(REPORT_DIR)/coverage.out)

build: clean style lint test

versionup:
	charlotte versionup

versionup-minor:
	charlotte versionup-minor
	
versionup-major:
	charlotte versionup-major

template:
	charlotte template
	
stop:
	NODE_ENV=$(NODE_ENV) node $(NAME).js stop
	
stop-npm:
	npm stop

start:
	NODE_ENV=$(NODE_ENV) node $(NAME).js start
	
start-npm:
	npm start

restart:
	NODE_ENV=$(NODE_ENV) node $(NAME).js restart

restart-npm:
	npm restart

status:
	NODE_ENV=$(NODE_ENV) node $(NAME).js status

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
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'mkdir -p $(BOB_DEPLOY_DIR);'
	scp -i $(BOB_DEPLOY_KEY) -P $(BOB_DEPLOY_PORT) $(ARTIFACT_DIR)/* $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST):$(BOB_DEPLOY_DIR)

deploy: send
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar;'

remote-r:
	ssh -i $(BOB_DEPLOY_KEY) -p $(BOB_DEPLOY_PORT) $(BOB_DEPLOY_USER)@$(BOB_DEPLOY_HOST) 'cd $(BOB_DEPLOY_DIR); NODE_ENV=$(NODE_ENV) node $(NAME).js restart;'

deploy-r: deploy remote-r
	
.PHONY: dep tools init clean style lint-strict lint test cover build versionup versionup-minor versionup-major template stop start restart status nuke package package-meta send deploy remote-r deploy-r
