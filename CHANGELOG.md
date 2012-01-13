### 0.3.0
*

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
