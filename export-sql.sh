#!/bin/bash

cd "$(dirname "$0")"
source "importer/spinner.sh"

print_usage()
{
    echo "\e[33mUsage: $0 load [directory with csvfiles | csvfile]"
    echo "\t\e[33mDocker image 'au5ton/cougar-grades.importer' must be built before using."
    echo "\t\e[33mUse 'make importer' to build"
    exit 0
}

if [ $# -eq 0 ]; then
    print_usage $0
    exit 0
fi

if [ $1 != "load" ]; then
    print_usage $0
    exit 0
fi

if [ ! -e "$2" ]; then
    print_usage $0
    exit 0
fi

start_spinner ">> Starting container..."
CONTAINER=$(sudo docker run -t -d -e COLUMNS=90 -e LINES=48 -e TERM=$TERM au5ton/cougar-grades.importer)
stop_spinner $?

SHRT=$(printf $CONTAINER | cut -c 1-5)
TWO=$(printf $2 | cut -c 1-10)
LEN=${#2}
if [ "$LEN" -gt "10" ]; then
    TWO="$TWO..." # add ellipsis
fi

echo " $ /opt/importer/install-dep.sh"
sudo docker exec $CONTAINER bash /opt/importer/install-dep.sh $SHRT

start_spinner ">> Container ready, copying: $2"
if [ -d "$2" ]; then
    #echo ">> Passed a directory, compressing:"
    tar -c payload/*.csv -f payload.tar.gz
    #echo ">> Copying to container"
    sudo docker cp payload.tar.gz $CONTAINER:/opt/
    rm payload.tar.gz # clean up
    #echo ">> Extracting within container"
    sudo docker exec $CONTAINER tar xf /opt/payload.tar.gz -C /opt
elif [ -f "$2" ]; then
    #echo ">> Copying file to container"
    sudo docker exec $CONTAINER mkdir /opt/payload
    sudo docker cp "$2" $CONTAINER:/opt/payload
else 
    echo ">> \e[31mFound nothing?"
fi
stop_spinner $?

sudo docker exec $CONTAINER tree /opt/payload

echo " $ ./csv2db.py /opt/payload/*.csv"
sudo docker exec $CONTAINER /bin/bash -c './csv2db.py /opt/payload/*.csv'
printf ">> records.db: "
sudo docker exec $CONTAINER du -hs records.db
start_spinner "$ sqlite3 records.db -cmd '.output records.sql' '.dump'"
sudo docker exec $CONTAINER sqlite3 records.db -cmd ".output records.sql" ".dump"
stop_spinner $?
start_spinner ">> Copy records out of container"
sudo docker cp $CONTAINER:/opt/importer/records.db .
sudo docker cp $CONTAINER:/opt/importer/records.sql .
stop_spinner $?

echo ">> Removing container"
sudo docker rm --force $CONTAINER
echo "\e[36mTo prune the downloaded Python docker image (~1.0GB), run:"
echo "\e[36m  make pruneimg"