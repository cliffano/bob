<img align="right" src="https://raw.github.com/cliffano/bob/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://github.com/cliffano/bob/workflows/CI/badge.svg)](https://github.com/cliffano/bob/actions?query=workflow%3ACI)
[![Security Status](https://snyk.io/test/github/cliffano/bob/badge.svg)](https://snyk.io/test/github/cliffano/bob)
[![Dependencies Status](https://img.shields.io/librariesio/release/npm/bob)](https://libraries.io/npm/bob)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/bob.svg)](https://coveralls.io/r/cliffano/bob?branch=master)
[![Published Version](https://img.shields.io/npm/v/bob.svg)](http://www.npmjs.com/package/bob)
<br/>

Bob
---

Convention-based build tool for node.js projects.

Bob provides a set of build-related tasks that work cross-platform and simple to use by following a few convention.

It works with zero configuration and allows minimal customisation when you don't want to use the default type of a particular task.

It only installs the default tools, while alternative tools will be lazy-installed as required.

It doesn't have plugins. It uses various CLI tools and configure their usage in task configuration files.

Installation
------------

    npm install -g bob

Project Convention
------------------

A project must have:

* package.json file, with at least name and version info
* lib/ directory, where you put your source code
* test/ directory, where you put your test code

Usage
-----

Run Bob: (from your project directory, where package.json is located)

    bob clean lint test coverage

Run Bob in robot mode: (generate machine-parsable output when possible)

    BOB_MODE=robot bob clean lint test coverage

Run Bob quietly: (only lists tasks, without each task's output)

    bob --quiet clean lint test coverage

Tasks
-----

In alphabetical order.

<table>
  <tr>
    <th>Task</th>
    <th>Description</th>
    <th>Default Type</th>
    <th>Alternative Type(s)</th>
  </tr>
  <tr>
    <td>clean</td>
    <td>Delete .bob directory</td>
    <td><a href="https://github.com/isaacs/rimraf">rimraf</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>complexity</td>
    <td>Run code complexity checker against *.js files in lib/ directory</td>
    <td><a href="http://github.com/jsoverson/plato">plato</a></td>
    <td><a href="http://github.com/nomiddlename/jscheckstyle">jscheckstyle</a></td>
  </tr>
  <tr>
    <td>coverage</td>
    <td>Check code coverage</td>
    <td><a href="http://github.com/arikon/mocha-istanbul">mocha-istanbul</a></td>
    <td><a href="http://github.com/kates/buster-istanbul">buster-istanbul</a></td>
  </tr>
  <tr>
    <td>dep</td>
    <td>Install dependencies specified in package.json</td>
    <td>npm</td>
    <td>-</td>
  </tr>
  <tr>
    <td>depgraph</td>
    <td>Generate module dependencies graph</td>
    <td><a href="http://github.com/pahen/node-madge">madge</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>doc</td>
    <td>Generate code documentation</td>
    <td><a href="http://github.com/jsdoc3/jsdoc">jsdoc</a></td>
    <td><a href="http://github.com/punkave/dox-foundation">dox-foundation</a></td>
  </tr>
  <tr>
    <td>lint</td>
    <td>Lint *.js files in lib/ and test/ directories</td>
    <td><a href="http://github.com/jshint/node-jshint">jshint</a></td>
    <td><a href="http://github.com/tav/nodelint">nodelint</a></td>
  </tr>
  <tr>
    <td>nuke <sup>TODO</sup></td>
    <td>Kill all processes with command containing the string 'node'</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>package</td>
    <td>Create an artifact file in .bob/artifact/ directory</td>
    <td><a href="https://github.com/cranic/node-tar.gz">tar.gz</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>publish</td>
    <td>Publish artifact file to a repository</td>
    <td><a href="http://www.npmjs.org">npm</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>restart</td>
    <td>Restart application</td>
    <td><a href="http://www.npmjs.org">npm</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>rmdep</td>
    <td>Remove node_modules directory.</td>
    <td><a href="https://github.com/isaacs/rimraf">rimraf</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>send <sup>TODO</sup></td>
    <td>Send artifact file to a remote server.</td>
    <td>scp</td>
    <td><a href="https://github.com/cliffano/sendman">sendman</a></td>
  </tr>
  <tr>
    <td>site</td>
    <td>Generate web site.</td>
    <td><a href="https://github.com/cliffano/ae86">ae86</a></td>
    <td><a href="https://github.com/nfroidure/buildbranch">buildbranch</a></td>
  </tr>
  <tr>
    <td>start</td>
    <td>Start application</td>
    <td><a href="http://www.npmjs.org">npm</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>status</td>
    <td>Status application</td>
    <td><a href="http://www.npmjs.org">npm</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>stop</td>
    <td>Stop application</td>
    <td><a href="http://www.npmjs.org">npm</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>test</td>
    <td>Execute unit test files in test/ directory</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a></td>
    <td><a href="http://github.com/busterjs/buster">buster</a>, <a href="http://github.com/caolan/nodeunit">nodeunit</a>, <a href="http://github.com/cloudhead/vows">vows</a></td>
  </tr>
  <tr>
    <td>test-acceptance</td>
    <td>Execute acceptance test files in test-acceptance/ directory</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a></td>
    <td><a href="http://github.com/cucumber/cucumber-js">cucumber</a></td>
  </tr>
  <tr>
    <td>test-integration</td>
    <td>Execute integration test files in test-integration/ directory</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a></td>
    <td><a href="http://github.com/busterjs/buster">buster</a>, <a href="http://github.com/cliffano/cmdt">cmdt</a></td>
  </tr>
  <tr>
    <td>test-performance</td>
    <td>Execute performance test files in test-performance/ directory</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>updep</td>
    <td>Upgrade all dependencies to latest version</td>
    <td><a href="http://github.com/cliffano/pkjutil">pkjutil</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>versionup</td>
    <td>Upgrade patch version number in package.json file</td>
    <td><a href="http://github.com/cliffano/pkjutil">pkjutil</a></td>
    <td>-</td>
  </tr>
</table>

Config
------

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

Continuous Integration
----------------------

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

### Travis CI

Configure Bob in .travis.yml file:

    before_install: "npm install -g bob"
    script: "bob clean lint test coverage"

Colophon
--------

[Developer's Guide](https://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://cliffano.github.io/bob/complexity/plato/index.html)
* [Unit tests report](https://cliffano.github.io/bob/test/mocha.txt)
* [Test coverage report](https://cliffano.github.io/bob/coverage/c8/index.html)
* [Integration tests report](https://cliffano.github.io/bob/test-integration/cmdt.txt)
* [API Documentation](https://cliffano.github.io/bob/doc/jsdoc/index.html)

Videos:

* [Evolution of bob (Gource Vizualisation)](https://www.youtube.com/watch?v=xc-qqky2a1w) by Landon Wilkins
