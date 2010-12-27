B0b
---

A very minimalistic build and deploy script

Installation
------------

    cd /path/to/b0b
    git clone git@github.com:/cliffano/b0b.git
    export B0B_HOME=/path/to/b0b
    export PATH=$PATH:$B0B_HOME/bin
    
Usage
-----

Create /path/to/myproject/b0b.cfg

    APP_NAME=myproject
    APP_VERSION=0.1
    DEPLOY_HOST=remote_host
    DEPLOY_PORT=22
    DEPLOY_DIR=/remote/path/to/myproject
    
Run B0b

    cd /path/to/myproject
    b0b clean lint test-unit test-web package deploy