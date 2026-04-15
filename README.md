![Avatar](avatar.jpg)

[![Build Status](https://github.com/cliffano/bob/workflows/CI/badge.svg)](https://github.com/cliffano/bob/actions?query=workflow%3ACI)
[![Security Status](https://snyk.io/test/github/cliffano/bob/badge.svg)](https://snyk.io/test/github/cliffano/bob)
[![Dependencies Status](https://img.shields.io/librariesio/release/npm/bob)](https://libraries.io/npm/bob)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/bob.svg)](https://coveralls.io/r/cliffano/bob?branch=main)
[![Published Version](https://img.shields.io/npm/v/bob.svg)](http://www.npmjs.com/package/bob)

# Bob

Convention-based build tool for node.js projects.

Bob provides a set of build-related tasks that work cross-platform and simple to use by following a few convention.

It works with zero configuration and allows minimal customisation when you don't want to use the default type of a particular task.

It only installs the default tools, while alternative tools will be lazy-installed as required.

It doesn't have plugins. It uses various CLI tools and configure their usage in task configuration files.

## Installation

    npm install -g bob

## Project Convention

A project must have:

* package.json file, with at least name and version info
* lib/ directory, where you put your source code
* test/ directory, where you put your test code

## Usage

Run Bob: (from your project directory, where package.json is located)

    bob clean lint test coverage

Run Bob in robot mode: (generate machine-parsable output when possible)

    BOB_MODE=robot bob clean lint test coverage

Run Bob quietly: (only lists tasks, without each task's output)

    bob --quiet clean lint test coverage

## Tasks

In alphabetical order.

| Task | Description | Default Type | Alternative Type(s) |
| --- | --- | --- | --- |
| clean | Delete .bob directory | [rimraf](https://github.com/isaacs/rimraf) | - |
| complexity | Run code complexity checker against *.js files in lib/ directory | [plato](http://github.com/jsoverson/plato) | - |
| coverage | Check code coverage | [c8](https://github.com/bcoe/c8) | - |
| dep | Install dependencies specified in package.json | npm | - |
| depgraph | Generate module dependencies graph | [madge](http://github.com/pahen/node-madge) | - |
| doc | Generate code documentation | [jsdoc](http://github.com/jsdoc3/jsdoc) | - |
| lint | Lint *.js files in lib/ and test/ directories | [eslint](https://eslint.org) | - |
| package | Create an artifact file in .bob/artifact/ directory | [tar.gz](https://github.com/cranic/node-tar.gz) | - |
| publish | Publish artifact file to a repository | [npm](http://www.npmjs.org) | - |
| rmdep | Remove node_modules directory. | [rimraf](https://github.com/isaacs/rimraf) | - |
| site | Generate web site. | [ae86](https://github.com/cliffano/ae86) | [buildbranch](https://github.com/nfroidure/buildbranch) |
| style | Style the code | [prettier](https://prettier.io) | - |
| test | Execute unit test files in test/ directory | [mocha](https://mochajs.org/) | [npm](http://www.npmjs.org) |
| test-acceptance | Execute acceptance test files in test-acceptance/ directory | [mocha](https://mochajs.org/) | [cucumber](http://github.com/cucumber/cucumber-js) |
| test-integration | Execute integration test files in test-integration/ directory | [mocha](https://mochajs.org/) | [cmdt](http://github.com/cliffano/cmdt) |
| updep | Upgrade all dependencies to latest version | [pkjutil](http://github.com/cliffano/pkjutil) | - |

## Config

To customise Bob for your project, create a .bob.json file in your project directory, where package.json is located.

To use nodelint instead of default jshint when running `bob lint`:

    {
      "lint": {
        "type": "nodelint"
      }
    }

To add an alias task (called build) which executes clean lint test coverage tasks:

    {
      "build": "clean lint test coverage"
    }

## Continuous Integration

### GitHub Workflow

Configure Bob in GitHub workflow YAML file:

    jobs:
      build:
        steps:
          - run: npm install -g bob
          - run: bob clean lint test coverage

### Jenkins CI

Configure Bob in a Jenkins job with shell script build step:

    npm install -g bob
    bob clean lint test coverage

## Colophon

[Developer's Guide](https://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://cliffano.github.io/bob/complexity/plato/index.html)
* [Unit tests report](https://cliffano.github.io/bob/test/mocha.txt)
* [Test coverage report](https://cliffano.github.io/bob/coverage/c8/index.html)
* [Integration tests report](https://cliffano.github.io/bob/test-integration/cmdt.txt)
* [API Documentation](https://cliffano.github.io/bob/doc/jsdoc/index.html)

Videos:

* [Evolution of bob (Gource Vizualisation)](https://www.youtube.com/watch?v=xc-qqky2a1w) by Landon Wilkins
