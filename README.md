Bob [![http://travis-ci.org/cliffano/bob](https://secure.travis-ci.org/cliffano/bob.png?branch=master)](http://travis-ci.org/cliffano/bob)
---

Convention-based build tool for Node.js projects.

This is handy for building (linting, testing the code, checking test code coverage, generating documentation, packaging artifact, etc) a Node.js project, with a minimal-or-zero configuration, by following a set of common convention.

There are two Bob modes, human and robot. By default Bob runs in human mode, generating output in human-readable format (e.g. test result in a plain text list). When robot mode is used, Bob will generate output in machine-parsable format (e.g. test result in XML), which is handy when you're using a continuous integration server that consumes XML files for rendering reports and charts.

Bob works where ever you can run `make`.

Installation
------------

    npm install -g bob

Project Convention
------------------

A project must contain:

* package.json file, with at least name and version info
* lib/ directory, containing *.js source files
* test/ directory, containing *.js test files

Usage
-----
    
Run Bob from project directory:
(same level as package.json file)

    bob clean lint test coverage ...

Run Bob in robot mode:
(if unspecified, BOB_MODE defaults to human)

    BOB_MODE=robot bob clean lint test coverage

Run Bob with verbose output:
(display make arguments and shell commands)

    BOB_MODE=robot bob --verbose clean lint test coverage

Run Bob with specific environment:
(if unspecified, NODE_ENV defaults to development)

    NODE_ENV=production bob start
    
Targets
-------

<table>
  <tr>
    <th>Target</th>
    <th>Description</th>
    <th>Types</th>
    <th>Parameters</th>
  </tr>
  <tr>
    <td>dep</td>
    <td>Install dependencies specified in package.json file by executing <code>npm install .</code> .</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rmdep</td>
    <td>Remove dependencies in node_modules directory.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>updep</td>
    <td>Upgrade all dependencies to latest version. Only use this if you want exact dependencies.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>tools</td>
    <td>Global install the tools used by Bob (e.g. jshint, nodelint, mocha, vows, etc).</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>rmtools</td>
    <td>Remove global installation of those tools.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>clean</td>
    <td>Delete .bob directory and *.log files.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>lint</td>
    <td>Lint *.js files in lib/ and test/ directories.</td>
    <td><a href="http://github.com/jshint/node-jshint">jshint</a> (default), <a href="http://github.com/tav/nodelint">nodelint</a>, <a href="http://github.com/ariya/esprima">esvalidate</a></td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>test</td>
    <td>Execute unit test files in test/ directory. If <code>{scripts.test}</code> is configured in package.json, then <code>npm test</code> will be executed instead.</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a> (default), <a href="http://github.com/caolan/nodeunit">nodeunit</a>, <a href="http://github.com/cloudhead/vows">vows</a></td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>complexity</td>
    <td>Run code complexity checker against *.js files in lib/ directory.</td>
    <td><a href="http://github.com/philbooth/complexityReport.js">complexity-report</a> (default), <a href="http://github.com/nomiddlename/jscheckstyle">jscheckstyle</a></td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>coverage</td>
    <td>Check code coverage.</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a> (default), <a href="http://github.com/cloudhead/vows">vows</a></td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>test-integration<sup>experimental</sup></td>
    <td>Execute integration test files in test-integration/ directory.</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a> (default)</td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>test-acceptance<sup>experimental</sup></td>
    <td>Execute acceptance test files in test-acceptance/ directory.</td>
    <td><a href="http://github.com/visionmedia/mocha">mocha</a> (default), <a href="http://github.com/cucumber/cucumber-js">cucumber</a></td>
    <td>bin, opts, files</td>
  </tr>
  <!--
  <tr>
    <td>doc</td>
    <td>Generate code documentation.</td>
    <td></a></td>
    <td>bin, opts, files</td>
  </tr>
  -->
  <tr>
    <td>depgraph</td>
    <td>Generate module dependencies graph.</td>
    <td><a href="http://github.com/pahen/node-madge">madge</a> (default)</td>
    <td>bin, opts, files</td>
  </tr>
  <tr>
    <td>package</td>
    <td>Create a package file in .bob/artifact/ directory, along with md5 and sha1 checksums of the artifact file.</td>
    <td>tar.gz (default), zip</td>
    <td>src, bin, opts</td>
  </tr>
  <tr>
    <td>publish</td>
    <td>Publish artifact file to an artifact repository.</td>
    <td><a href="http://www.npmjs.org">npm</a> (default), <a href="http://ant.apache.org/ivy/">ivy</a></td>
    <td>ivy: user, key, host, port, dir</td>
  </tr>
  <tr>
    <td>send</td>
    <td>Send the artifact file to a remote server.</td>
    <td>scp (default), ftp</td>
    <td>user, key, host, port, dir</td>
  </tr>
  <tr>
    <td>stop</td>
    <td>Stop the app by executing <code>node {name}.js stop</code> . If <code>scripts.stop</code> is configured in package.json, then <code>npm stop</code> will be executed instead.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>start</td>
    <td>Start the app by executing <code>node {name}.js start</code> . If <code>scripts.start</code> is configured in package.json, then <code>npm start</code> will be executed instead.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>restart</td>
    <td>Restart the app by executing <code>node {name}.js restart</code>  . If <code>scripts.restart</code> is configured in package.json, then <code>npm restart</code> will be executed instead.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>status</td>
    <td>Display app status by executing <code>node {name}.js status</code> .</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>versionup</td>
    <td>Upgrade patch version number in package.json file.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>versionup-minor</td>
    <td>Upgrade minor version number in package.json file.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>versionup-major</td>
    <td>Upgrade major version number in package.json file.</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>nuke</td>
    <td>Kill all processes with command containing the word 'node' .</td>
    <td>-</td>
    <td>-</td>
  </tr>
</table>

Config
------

To override the default setting, create .bob.json file in project directory (same level as package.json file). Target type and parameters can be overridden, here are some examples:

To use nodelint instead of the default jshint when running `bob lint`:

    {
      "lint": {
        "type": "nodelint"
      }
    }

To use nodelint instead of the default jshint, and to lint the files in src directory instead of the default lib and test directories, when running bob lint:

    {
      "lint": {
        "type": "nodelint",
        "files": "src"
      }
    }

To add an alias target (called build) which executes clean lint test coverage targets:

    {
      "build": "clean lint test coverage"
    }

Continuous Integration
----------------------

###Travis CI

Configure Bob in .travis.yml file:

    before_install: "npm install -g bob"
    script: "bob clean lint test coverage"

###Jenkins CI

Configure Bob in a Jenkins job with shell script build step:

    npm install -g bob
    bob clean lint test coverage
