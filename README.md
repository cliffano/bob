Bob
---

A minimalistic build script for Node.js projects.

Overview
--------

Bob provides standard build targets (clean, lint, test, package, deploy, stop, start, status, restart) for Node.js libs/apps following certain conventions.

Installation
------------

    npm install -g bob

Config
------

Bob reads package.json file, properties under "app" are optional.

    {
        "name": "myproject",
        "version": "0.0.1",
        "app": {
            "src": {
                "dir": "/path/to/myproject/mysrc"
            }
            "deploy": {
                "host": "myremotehost",
                "port": 22,
                "dir": "/remote/path/to/myproject"
            }
        }
    }

Usage
-----
    
Run Bob from project directory.

    bob target1 target2 target3 ...

With specific environment (by default it uses NODE_ENV=development)

    NODE_ENV=production bob start
    
Targets
-------

* clean - Delete build/ and run/ directory
* lint - Run `nodelint` against all .js files under lib/ and test/ directories plus additional files configured in app.build.lint
* hint - Run `jshint` against all .js files under lib/ and test/ directories plus additional files configured in app.build.hint
* test - Run `vows` against all .js files under test/ directory
* package - Create a source .tar.gz package at build/package/ directory
* stop - Stop the app
* start - Start the app
* restart - Restart the app
* status - Display app status
* nuke - Kill all processes with command containing the word 'node'
* deploy - Deploy the package to app.deploy.host:app.deploy.port at app.deploy.dir
* deploy-r - Deploy the package and then remotely restart the app
