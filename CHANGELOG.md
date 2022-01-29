# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Upgrade deps to latest

## 2.6.0 - 2022-01-25
### Changed
- Upgrade deps to latest
- Add GH Actions release-* and publish-*

### Fixed
- Fix broken cli unit tests

## 2.5.0 - 2020-12-05
### Fixed
- Fix missing site ae86 dependency

## 2.4.0 - 2020-12-05
### Removed
- Remove optional dependencies support

## 2.3.0 - 2020-11-29
### Added
- Add new task property postOpts
- Add new task property preOpts as alias of task property opts

### Changed
- Set min node engine to >= 14.0.0

## 2.2.0 - 2020-09-26
### Changed
- Replace .bob/report/<task>/<type>.out and .bob/report/<task>/<type>.txt files
- Upgrade ae86 to 2.0.0

## 2.1.0 - 2020-06-12
### Added
- Add html reporter to coverage c8 human mode

### Changed
- Replace Travis CI with GitHub Actions

### Fixed
- Fix npm warn duplicated mocha declaration

## 2.0.1 - 2020-06-08
### Fixed
- Fix unknown file extension error on bin entry point

## 2.0.0 - 2020-06-08
### Added
- Add eslint as lint task type and set as default
- Add c8 as coverage tasks type and set as default

### Changed
- Change module type to ESM
- Change default doc task type to jsdoc
- Change bob build to use eslint and mocha
- Set min node engine to >= 13.0.0

### Removed
- Remove buster-istanbul and mocha-istanbul coverage types
- Remove buster, nodeunit, and vows test types
- Remove start, stopm and restart tasks
- Remove jscheckstyle complexity type
- Remove dox-foundation doc type
- Remove jshint and nodelint lint types
- Remove buster-test test-integration type

## 1.0.1 - 2019-04-13
### Changed
- Dependencies upgrade

## 1.0.0 - 2017-06-10
### Added
- Add jsdoc doc task type

### Changed
- Change default doc task type from dox-foundation to jsdoc
- Replace canihaz with canihaz-pakkunbot
- Force canihaz location to Bob directory

## 0.7.6 - 2016-08-19
### Changed
- Set min node engine to >= 4.0.0
- Dependencies upgrade

## 0.7.5 - 2016-02-12
### Changed
- Dependencies upgrade, latest tool reports

## 0.7.4 - 2015-11-14
### Changed
- Increase child process max buffer to 1000Kb

## 0.7.3 - 2015-06-21
### Added
- Add buildbranch to site tool
- Add tmp temporary directory to template params

## 0.7.2 - 2015-01-15
### Changed
- Update tools to latest

## 0.7.1 - 2014-09-10
### Changed
- Ensure optDependencies is only installed once per module

## 0.7.0 - 2014-03-18
### Changed
- Change depgraph madge generated graph from madge.png to madge/graph.png
- Change report base directory from .bob/report/<task>/<type>/ to .bob/<task>/<type>/
- Change test-integration cmdt base directory to .bob/test-integration
- Change min node engine to >=v0.10.0

## 0.6.2 - 2013-12-12
### Added
- Add opts debug and base dir to test-integration cmdt type, base dir is set to .bob/stage/cmdt-*
- Add site command with ae86 type

### Changed
- Replace send ftp type with sendman

## 0.6.0 - 2013-10-23
### Added
- Add test npm type
- Add test-integration cmdt type

### Changed
- Support multiple task types
- Only pre-install Bob core and default task type modules
- Lazy install non-default task type modules
- Replace .bob/report/<task>.out files with .bob/report/<task>/<type>.out files
- Use mocha-istanbul as default coverage task type

### Removed
- Remove dependency to Make and makefile
- Remove esvalidate lint type due to its CLI not accepting dir args (need to avoid usage of *nix-specific find command)
- Remove publish ivy type (it was a nice experiment, but we all know better by now)
- Remove package tar and zip types (will re-add when there's a cross-platform tar and zip cli for node)
- Remove (jscoverage-related) coverage mocha and vows task types since they are not cross-platform
- Remove tools and rmtools tasks, no longer needed since Bob now lazy installs non-default types

## 0.5.25 - 2013-08-28
### Changed
- Change updep target to use pkjutil
- Change versionup target to use pkjutil, remove versionup-minor and versionup-major targets (to be replaced with versionup and major/minor type arg)

## 0.5.24 - 2013-05-23
### Changed
- Upgrade tools to latest greatest

## 0.5.23 - 2013-05-21
### Added
- Add html to mocha-istanbul reporters

## 0.5.22 - 2013-05-16
### Added
- Add test-performance target

## 0.5.21 - 2013-05-14
### Added
- Add report generation to mocha-istanbul coverage target for human mode

## 0.5.20 - 2013-05-09
### Added
- Add report output directory to mocha-istanbul coverage target

## 0.5.19 - 2013-05-06
### Added
- Add mocha-istanbul type to coverage target

## 0.5.18 - 2013-04-14
### Changed
- Use dox-foundation as default doc target type
- Use plato as default complexity target type

### Removed
- Remove expresso due to installation taking more than 1 minute, mocha and vows coverage types (with instrument-jscoverage dep) require global installation of expresso manually to get node-jscoverage binary

## 0.5.17 - 2013-03-16

## 0.5.16 - 2013-01-18
### Added
- Add buster-istanbul type to coverage target

## 0.5.15 - 2013-01-14
### Added
- Add buster type to test-integration target

## 0.5.14 - 2013-01-09
### Added
- Add complexity target, with complexity-report as default type, and jscheckstyle as optional type

### Removed
- Remove style target

## 0.5.13 - 2013-01-04
### Added
- Add tar type to package target
- Add buster test option

## 0.5.12 - 2012-11-26

## 0.5.11 - 2012-11-26
### Added
- Add type support to package target, available types: tar.gz (default) and zip

## 0.5.10 - 2012-11-23
### Added
- Add proxy support to updep target
- Add cucumber type to test-acceptance target

## 0.5.9 - 2012-11-12
### Added
- Add invalid package.json and .bob.json error handling.

## 0.5.8 - 2012-11-11
### Added
- Add updep target

## 0.5.7 - 2012-11-07
### Changed
- Colourise SUCCESS/FAILURE status

### Removed
- Move esvalidate from validate target to lint target's type
- Remove validate target

## 0.5.6 - 2012-10-30
### Added
- Add validate target

## 0.5.5 - 2012-10-30
### Added
- Add depgraph target using madge as default type
- Add test-acceptance target

### Changed
- Increase node engine min version to >= 0.6.0

## 0.5.4 - 2012-09-05
### Added
- Add test-integration target

## 0.5.3 - 2012-08-30
### Added
- Add alias target support
- Add nodeunit type to test target

### Changed
- Modify jscoverage-based coverage target to always reinstrument, to allow multiple coverage target calls without clean

## 0.5.2 - 2012-08-25
### Added
- Add --verbose opt to display make arguments and shell commands

## 0.5.1 - 2012-08-25
### Changed
- Change publish-ivy target to use ivy.xml instead of conf/ivy.xml

## 0.5.0 - 2012-08-22
### Added
- Add rmdep and rmtools targets
- Add publish target
- Add ivy target, replacing a combination of template + package-meta + ssh-mkdir targets

### Changed
- Change default test tool from vows to mocha
- Make is executed with --silent to declutter output
- Replace build with .bob as Bob-generated build directory
- Init target no longer creates run directory
- package target now uses src, instead of src.dir, in package.json

## 0.4.7 - 2012-07-26
### Changed
- Modify package target to exclude only build and run directories on current directory

## 0.4.6 - 2012-07-25
### Changed
- Upgrade jscheckstyle to v0.0.6

## 0.4.5 - 2012-06-26
### Changed
- Temp remove ndoc due to node v0.8.0 build incompatibility issue

## 0.4.4 - 2012-06-26
### Changed
- Set max node version to < 0.9.0

## 0.4.3 - 2012-05-10
### Added
- Add mocha test option

## 0.4.2 - 2012-03-25

## 0.4.1 - 2012-02-27

## 0.4.0 - 2012-02-27
### Added
- Add .bob.json configuration file support
- Add shh-mkdir target to create remote directory to deploy to

### Changed
- Re-add scripts.test override
- Rename deploy-unpack to ssh-unpack, deploy-restart to ssh-restart

## 0.3.4 - 2012-02-25

## 0.3.3 - 2012-02-24
### Added
- Add doc target, using ndoc as default doc tool

### Changed
- Replace jquery object extend with valentine's

## 0.3.2 - 2012-02-08
### Added
- Add ftp type support for deploy target

### Changed
- Send target no longer creates base directory
- Change vows dependency to cloudhead/vows master now that --cover-xml pull request is merged

### Removed
- Remove send target, add deploy-unpack target

## 0.3.1 - 2012-02-01
### Changed
- Coverage target no longer requires global node-jscoverage

## 0.3.0 - 2012-01-30
### Added
- Introduce task type, this provides flexibility for having task type specific target execution.

### Changed
- Tools target is now optional and only a handy convenience for executing tools against a single file
- bob -v now returns Bob version, not make version
- Template config now uses an array of template file names, previously it was an object with template file name as key and array of parameters as value.
- lintstrict target is replaced with lint target having bob.lint.type: nodelint
- scripts.test no longer overrides test target, this is to allow Bob usage on Travis

### Removed
- Move tools dependency to local to simplify installation

## 0.2.11 - 2011-11-23
### Changed
- Display build SUCCESS/FAILURE message based on exit code
- Robot mode coverage now generates xml report, while html report is now generated on any mode

### Removed
- Remove empty line from output display

## 0.2.10 - 2011-11-23
### Changed
- Replace node-runforcover with good ol' node-jscoverage

## 0.2.9 - 2011-10-27
### Added
- Add function support to template target, starting with now(format) function
- Add build target which calls style, lint, and test targets

### Changed
- Make coverage target work by using cliffano/vows with cliffano/node-runforcover
- Rename lint target to lintstrict, hint to lint, checkstyle to style

## 0.2.7 - 2011-10-20
### Changed
- Switch main app file back to {name}.js (apology for the flip-flop)

## 0.2.6 - 2011-10-19
### Added
- Add package-meta target
- Add md5 and sha1 hash for package and package-meta
- Add versionup, versionup-minor, versionup-major targets
- Add template target
- Add custom user and key for deploy target
- Add send target, sends all files in {artifact.dir}
- Add variable support in configuration values

### Changed
- Deploy target now depends on send target, then unpacks the main .tar.gz artifact

## 0.2.5 - 2011-10-12
### Changed
- Honour npm scripts.test|stop|start|restart if exists in place of test, stop, start, restart tasks

## 0.2.4 - 2011-09-27
### Changed
- Change main app file to {name}-app.js

## 0.2.3 - 2011-09-26
### Changed
- Use underscore extend to merge config files
- Package artifact includes name-version base directory

## 0.2.2 - 2011-09-23
### Changed
- Text and coverage tests *.js files in test/ dir and subdirs by default
- Stream child process output

## 0.2.1 - 2011-09-20
### Added
- Add mode support (BOB_MODE=robot FTW!)

## 0.2.0 - 2011-09-19
### Added
- Add checkstyle, coverage, dep, hint, nuke targets

### Changed
- Replace Cake with plain Makefile
- Replace ghibli.sh with plain node * start|stop|restart|status

## 0.1.0 - 2011-08-19
### Changed
- Replace ShellScript + Make + Python with CoffeeScript + Cake

## 0.0.1 - 2011-06-18
### Added
- Initial version
