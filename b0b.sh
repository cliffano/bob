#! /bin/sh

TOOL_DIR="/var/www/tool"

make -f $TOOL_DIR/b0b/Makefile \
    APP_NAME="b0b" \
    APP_VERSION="0.1-SNAPSHOT" \
    APP_DIR=`pwd` \
    DEPLOY_SUBDIR="tool/b0b" \
    TOOL_DIR="$TOOL_DIR" \
    $1 $2 $3 $4 $5 $6 $7 $8 $9