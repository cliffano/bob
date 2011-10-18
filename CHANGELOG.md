### 0.2.6
* Fix robot mode nodelint to generate xml report
* Add package-meta target
* Add md5 and sha1 hash for package and package-meta
* Add versionup, versionup-minor, versionup-major targets

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
