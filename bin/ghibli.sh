#! /bin/sh

NAME=$1
DIR=$2
FILE="$NAME-app.js"

get_pid() {
    pid=`ps -ef | sed -n '/node .*'"$FILE"'/{/grep/!p;}' | awk '{print$2}'`;
    echo "$pid";
}

case $3 in
"start")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        cd $DIR
        echo "Starting $NAME in $4 environment at $DIR."
        ENV=$4 nohup node $DIR/$FILE > $DIR/nohup.out 2> $DIR/nohup.err < /dev/null &
        pid=$(get_pid)
        echo "$NAME is running on pid $pid."
    else
        echo "$NAME is already running on pid $pid."
    fi;;
"status")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        echo "$NAME is not running."
    else
        echo "$NAME is running on pid $pid."
    fi;;
"stop")
    pid=$(get_pid);
    if [ -z $pid ]
    then
        echo "$NAME is not running."
    else
        echo "Stopping $NAME on pid $pid."
        kill -9 "$pid"
    fi;;
*)
    echo "Usage:\n\t$0 NAME DIR <start|stop|status> ENV";;
esac