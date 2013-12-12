### 0.6.2-pre
* Add opts debug and base dir to test-integration cmdt type, base dir is set to .bob/stage/cmdt-*
* Add site command with ae86 type
* Replace send ftp type with sendman
* Fix random tasks execution sequence

### 0.6.0
* Remove dependency to Make and makefile
* Support multiple task types
* Only pre-install Bob core and default task type modules
* Lazy install non-default task type modules
* Replace .bob/report/<task>.out files with .bob/report/<task>/<type>.out files
* Remove esvalidate lint type due to its CLI not accepting dir args (need to avoid usage of *nix-specific find command)
* Use mocha-istanbul as default coverage task type
* Remove publish ivy type (it was a nice experiment, but we all know better by now)
* Remove package tar and zip types (will re-add when there's a cross-platform tar and zip cli for node)
* Add test npm type
* Remove (jscoverage-related) coverage mocha and vows task types since they are not cross-platform
* Remove tools and rmtools tasks, no longer needed since Bob now lazy installs non-default types
* Add test-integration cmdt type

### 0.5.25
* Change updep target to use pkjutil
* Change versionup target to use pkjutil, remove versionup-minor and versionup-major targets (to be replaced with versionup and major/minor type arg)

### 0.5.24
* Upgrade tools to latest greatest

### 0.5.23
* Add html to mocha-istanbul reporters

### 0.5.22
* Add test-performance target

### 0.5.21
* Add report generation to mocha-istanbul coverage target for human mode

### 0.5.20
* Add report output directory to mocha-istanbul coverage target
* Fix mocha-istanbul to work with files in test subdirectories

### 0.5.19
* Add mocha-istanbul type to coverage target

### 0.5.18
* Use dox-foundation as default doc target type
* Use plato as default complexity target type
* Remove expresso due to installation taking more than 1 minute, mocha and vows coverage types (with instrument-jscoverage dep) require global installation of expresso manually to get node-jscoverage binary

### 0.5.17
* Fix buster test command check error

### 0.5.16
* Add buster-istanbul type to coverage target

### 0.5.15
* Add buster type to test-integration target

### 0.5.14
* Add complexity target, with complexity-report as default type, and jscheckstyle as optional type
* Remove style target

### 0.5.13
* Add tar type to package target
* Fix mocha type test* to run all tests in subdirectories
* Add buster test option

### 0.5.12
* Fix package zip type opts to make it work on RHEL other than Ubuntu and OS X

### 0.5.11
* Add type support to package target, available types: tar.gz (default) and zip

### 0.5.10
* Add proxy support to updep target
* Add cucumber type to test-acceptance target

### 0.5.9
* Add invalid package.json and .bob.json error handling.
* Fix mocha's coloured text output in human mode

### 0.5.8
* Add updep target

### 0.5.7
* Move esvalidate from validate target to lint target's type
* Remove validate target
* Colourise SUCCESS/FAILURE status

### 0.5.6
* Add validate target

### 0.5.5
* Add depgraph target using madge as default type
* Increase node engine min version to >= 0.6.0
* Add test-acceptance target

### 0.5.4
* Add test-integration target 

### 0.5.3
* Modify jscoverage-based coverage target to always reinstrument, to allow multiple coverage target calls without clean
* Add alias target support
* Add nodeunit type to test target

### 0.5.2
* Add --verbose opt to display make arguments and shell commands

### 0.5.1
* Change publish-ivy target to use ivy.xml instead of conf/ivy.xml
* Fix package.json node_modules location in instrument-jscoverage target

### 0.5.0
* Change default test tool from vows to mocha
* Add rmdep and rmtools targets
* Make is executed with --silent to declutter output
* Replace build with .bob as Bob-generated build directory
* Init target no longer creates run directory
* package target now uses src, instead of src.dir, in package.json
* Add publish target
* Add ivy target, replacing a combination of template + package-meta + ssh-mkdir targets

### 0.4.7
* Modify package target to exclude only build and run directories on current directory

### 0.4.6
* Upgrade jscheckstyle to v0.0.6 

### 0.4.5
* Temp remove ndoc due to node v0.8.0 build incompatibility issue

### 0.4.4
* Set max node version to < 0.9.0

### 0.4.3
* Add mocha test option

### 0.4.2
* Fix broken ssh-* targets

### 0.4.1
* Fix broken template target

### 0.4.0
* Re-add scripts.test override
* Add .bob.json configuration file support
* Rename deploy-unpack to ssh-unpack, deploy-restart to ssh-restart
* Add shh-mkdir target to create remote directory to deploy to

### 0.3.4 
* Fix package.json and node_modules symlink in build/stage for coverage target

### 0.3.3
* Fix config value handling when dsv is x.y.z with undefined x.y but z exists
* Add doc target, using ndoc as default doc tool
* Replace jquery object extend with valentine's

### 0.3.2
* Send target no longer creates base directory
* Add ftp type support for deploy target
* Remove send target, add deploy-unpack target
* Change vows dependency to cloudhead/vows master now that --cover-xml pull request is merged

### 0.3.1
* Coverage target no longer requires global node-jscoverage

### 0.3.0
* Move tools dependency to local to simplify installation
* Tools target is now optional and only a handy convenience for executing tools against a single file
* bob -v now returns Bob version, not make version
* Template config now uses an array of template file names, previously it was an object with template file name as key and array of parameters as value.
* Introduce task type, this provides flexibility for having task type specific target execution.
* lintstrict target is replaced with lint target having bob.lint.type: nodelint
* scripts.test no longer overrides test target, this is to allow Bob usage on Travis

### 0.2.11
* Remove empty line from output display
* Display build SUCCESS/FAILURE message based on exit code
* Robot mode coverage now generates xml report, while html report is now generated on any mode

### 0.2.10
* Replace node-runforcover with good ol' node-jscoverage

### 0.2.9
* Make coverage target work by using cliffano/vows with cliffano/node-runforcover 
* Add function support to template target, starting with now(format) function
* Rename lint target to lintstrict, hint to lint, checkstyle to style
* Add build target which calls style, lint, and test targets

### 0.2.7
* Switch main app file back to {name}.js (apology for the flip-flop)
* Fix versionup-minor and versionup-major to reset lower-priority numbers to 0

### 0.2.6
* Fix robot mode nodelint to generate xml report
* Add package-meta target
* Add md5 and sha1 hash for package and package-meta
* Add versionup, versionup-minor, versionup-major targets
* Add template target
* Add custom user and key for deploy target
* Add send target, sends all files in {artifact.dir}
* Deploy target now depends on send target, then unpacks the main .tar.gz artifact
* Add variable support in configuration values

### 0.2.5
* Fix exit code for checkstyle, hint, lint, test tasks
* Honour npm scripts.test|stop|start|restart if exists in place of test, stop, start, restart tasks

### 0.2.4
* Fix custom source dir config
* Change main app file to {name}-app.js

### 0.2.3
* Use underscore extend to merge config files
* Package artifact includes name-version base directory

### 0.2.2
* Text and coverage tests *.js files in test/ dir and subdirs by default
* Stream child process output

### 0.2.1
* Add mode support (BOB_MODE=robot FTW!)

### 0.2.0
* Add checkstyle, coverage, dep, hint, nuke targets
* Replace Cake with plain Makefile
* Replace ghibli.sh with plain node * start|stop|restart|status

### 0.1.0
* Replace ShellScript + Make + Python with CoffeeScript + Cake

### 0.0.1
* Initial version
