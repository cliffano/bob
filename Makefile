SUNTORY_VERSION = 0.9.0-pre.0

################################################################
# User configuration variables
# These variables should be stored in suntory.yml config file,
# and they will be parsed using yq https://github.com/mikefarah/yq
# Example:
# ---
# package_name: somepackage
# author: Some Author

# PACKAGE_NAME is the name of the Python package
PACKAGE_NAME=$(shell yq .package_name suntory.yml)

# AUTHOR is the author of the Python package
AUTHOR ?= $(shell yq .author suntory.yml)

$(info ################################################################)
$(info Building node package using suntory with user configurations:)
$(info - Package name: ${PACKAGE_NAME})
$(info - Author: ${AUTHOR})

export PATH := node_modules/bin:$(PATH)

################################################################
# Base targets

# CI target to be executed by CI/CD tool
all:ci
ci: deps clean style lint test coverage complexity doc package reinstall test-integration

# Ensure stage directory exists
stage:
	mkdir -p stage

# Remove all temporary (staged, generated, cached) files
clean:
	bob clean

# Retrieve the Pyhon package dependencies
deps:
	npm install .
	npm link
	bob dep

deps-upgrade:
	bob updep

rmdeps:
	bob rmdep

# Update Makefile to the latest version tag
update-to-latest: TARGET_SUNTORY_VERSION = $(shell curl -s https://api.github.com/repos/cliffano/suntory/tags | jq -r '.[0].name')
update-to-latest: update-to-version

# Update Makefile to the main branch
update-to-main:
	curl https://raw.githubusercontent.com/cliffano/{{ project_id }}/main/src/Makefile-{{ project_id }} -o Makefile

# Update Makefile to the version defined in TARGET_{{ project_id }}_VERSION parameter
update-to-version:
	curl https://raw.githubusercontent.com/cliffano/{{ project_id }}/$(TARGET_{{ project_id }}_VERSION)/src/Makefile-{{ project_id }} -o Makefile

# Update dotfiles using the generator-python
update-dotfiles: GENERATOR_COMPONENT = $(shell yq .generator.component piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_PROJECT_ID = $(shell yq .generator.inputs.project_id piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_PROJECT_NAME = $(shell yq .generator.inputs.project_name piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_PROJECT_DESC = $(shell yq .generator.inputs.project_desc piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_AUTHOR_NAME = $(shell yq .generator.inputs.author_name piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_AUTHOR_EMAIL = $(shell yq .generator.inputs.author_email piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_GITHUB_ID = $(shell yq .generator.inputs.github_id piemaker.yml)
update-dotfiles: GENERATOR_INPUTS_GITHUB_REPO = $(shell yq .generator.inputs.github_repo piemaker.yml)
update-dotfiles: stage
	cd stage/ && \
	  rm -rf generator-node/ && \
	  git clone https://github.com/cliffano/generator-node && \
	  cd generator-node && \
	  make deps && \
	  node_modules/.bin/plop $(GENERATOR_COMPONENT) -- \
	    --project_id "$(GENERATOR_INPUTS_PROJECT_ID)" \
		--project_name "$(GENERATOR_INPUTS_PROJECT_NAME)" \
		--project_desc "$(GENERATOR_INPUTS_PROJECT_DESC)" \
		--author_name "$(GENERATOR_INPUTS_AUTHOR_NAME)" \
		--author_email "$(GENERATOR_INPUTS_AUTHOR_EMAIL)" \
		--github_id "$(GENERATOR_INPUTS_GITHUB_ID)" \
		--github_repo "$(GENERATOR_INPUTS_GITHUB_REPO)"
	cd stage/generator-node/stage/$(GENERATOR_COMPONENT) && \
	  cp -R .github/* ../../../../.github/ && \
	  cp .bob.json ../../../../.bob.json && \
	  cp .gitignore ../../../../.gitignore && \
	  cp .npmignore ../../../../.npmignore && \
	  cp .rtk.json ../../../../.rtk.json && \
	  cp eslint.config.js ../../../../eslint.config.js

################################################################
# Formatting targets

style:
	bob style

################################################################
# Testing targets

lint: stage
	bob lint

complexity: stage
	bob complexity

test:
	bob test

test-integration:
	bob test-integration

test-examples:
	mkdir -p stage/test-examples/
	cd examples && \
	for f in *.sh; do \
	  bash -x "$$f"; \
	done

coverage:
	bob coverage

################################################################
# Release targets

release-major:
	rtk release --release-increment-type major

release-minor:
	rtk release --release-increment-type minor

release-patch:
	rtk release --release-increment-type patch

################################################################
# Packaging, installation, and publishing targets

package:
	bob package

install: package
	npm link .

uninstall:
	npm unlink .

reinstall: uninstall install

publish:
	npm publish

################################################################
# Documentation targets

doc: stage
	bob doc

################################################################

.PHONY: all ci clean complexity configurations coverage deps deps-extra-apt deps-upgrade rmdeps doc export export export install install-wheel lint name package package publish reinstall release-major release-minor release-patch stage style test test-examples test-integration uninstall update-to-latest update-to-latest update-to-main update-to-version