B0b
---

A very minimalistic build, deploy, and startup script for NodeJS apps
Also a handy build script for JS libraries

Installation
------------

    cd /path/to/b0b
    git clone git@github.com:/cliffano/b0b.git
    export B0B_HOME=/path/to/b0b
    export PATH=$PATH:$B0B_HOME/bin

Config
------

An app can have a config file.
Create /path/to/mystuff/b0b.cfg file with the following properties:

    APP_NAME=mystuff
    APP_VERSION=0.1
    DEPLOY_HOST=myremotehost
    DEPLOY_PORT=22
    DEPLOY_DIR=/remote/path/to/mystuff

This config file is not necessary for JS libraries.

Usage
-----
    
Run B0b

    cd /path/to/mystuff
    b0b target1 target2 target3 ...
    
Targets
-------

Build

    clean:
    Delete build/
    
    lint:
    Run `nodelint` against all .js files under lib/ and custom files configured in BUILD_LINT_FILES
    
    test-unit:
    Run `vows` against all .js files under test/unit/ 
    
    test-web:
    Run `watir` test at test/web/main.rb
    
    package:
    Create a .tar.gz package of the app/library at build/package/

Deploy

    deploy:
    Deploy the package to DEPLOY_HOST:DEPLOY_PORT:DEPLOY_DIR
    
    deploy-r:
    Deploy the package and then remotely restart the app

Startup

    start-dev:
    Start the app in development mode
    
    start-prd:
    Start the app in production mode
    
    stop:
    Stop the app
    
    restart-dev:
    Stop the app, then start it in development mode
    
    restart-prd:
    Stop the app, then start it in production mode
    
    status:
    Display the status of the app, whether it's running or not