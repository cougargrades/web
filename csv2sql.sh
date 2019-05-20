#!/bin/bash

cd "$(dirname "$0")"
source "importer/spinner.sh"

print_usage()
{
echo -e "\e[33mUsage: "$(basename $0)" [directory with csvfiles | csvfile] [--cleanup]
    Docker image 'au5ton/cougar-grades.importer' must be built before using.
    Use 'make importer' to build.
    Script is argument order sensitive.
    The --cleanup tag will:
    - run 'make importer'
    - delete 'python:3.7' image on exit
    - delete 'au5ton/cougar-grades.importer' image on exit"
exit 0
}

if [ $# -eq 0 ]; then
    print_usage $0
    exit 0
fi

if [ ! -e "$1" ]; then
    print_usage $0
    exit 0
fi

if [ "$EUID" -ne 0 ]; then
    echo -e "\e[91mPlease run as root"
    exit 0
fi

if [ "$2" == "--cleanup" ]; then
    start_spinner ">> make importer"
    make importer > /dev/null 2>&1
    stop_spinner $?
fi

if [ -z $(sudo docker images -q 'au5ton/cougar-grades.importer') ]; then
    echo -e "\e[91mDocker image 'au5ton/cougar-grades.importer' not yet built. Use 'make importer' or --cleanup"
    exit 0
fi

start_spinner ">> Starting container..."
CONTAINER=$(sudo docker run -t -d -e COLUMNS=90 -e LINES=48 -e TERM=$TERM au5ton/cougar-grades.importer)
stop_spinner $?

SHRT=$(printf $CONTAINER | cut -c 1-5)
TWO=$(printf $1 | cut -c 1-10)
LEN=${#1}
if [ "$LEN" -gt "10" ]; then
    TWO="$TWO..." # add ellipsis
fi

echo " $ /opt/importer/install-dep.sh"
sudo docker exec $CONTAINER bash /opt/importer/install-dep.sh $SHRT

start_spinner ">> Container ready, copying: $1"
if [ -d "$1" ]; then
    #echo ">> Passed a directory, compressing:"
    tar -c $1/*.csv -f payload.tar.gz
    #echo ">> Copying to container"
    sudo docker cp payload.tar.gz $CONTAINER:/opt/
    rm payload.tar.gz # clean up
    #echo ">> Extracting within container"
    sudo docker exec $CONTAINER tar xf /opt/payload.tar.gz -C /opt
    sudo docker exec $CONTAINER mv /opt/$(basename $1) /opt/payload
elif [ -f "$1" ]; then
    #echo ">> Copying file to container"
    sudo docker exec $CONTAINER mkdir /opt/payload
    sudo docker cp "$1" $CONTAINER:/opt/payload
else 
    echo -e ">> \e[31mFound nothing?"
fi
stop_spinner $?

sudo docker exec $CONTAINER tree /opt/payload

echo " $ ./csv2db.py /opt/payload/*.csv"
sudo docker exec $CONTAINER /bin/bash -c './csv2db.py /opt/payload/*.csv'
sudo docker exec $CONTAINER bash /opt/importer/sqlite2maria.sh $SHRT
start_spinner ">> Copy records out of container"
sudo docker cp $CONTAINER:/opt/importer/records.db .
sudo docker cp $CONTAINER:/opt/importer/records.sql .
stop_spinner $?

echo ">> Removing container"
sudo docker rm --force $CONTAINER

if [ "$2" == "--cleanup" ]; then
    IMGSIZE=0
    IMGTMP=$(docker image inspect python:3.7 --format="{{.Size}}")
    IMGSIZE=$((IMGSIZE + IMGTMP))
    IMGTMP=$(docker image inspect au5ton/cougar-grades.importer --format="{{.Size}}")
    IMGSIZE=$((IMGSIZE + IMGTMP))
    IMGSIZE=$(numfmt --to=iec $IMGSIZE)
    start_spinner ">> Cleaning up $IMGSIZE worth of docker images"
    sudo docker rmi --force au5ton/cougar-grades.importer > /dev/null 2>&1
    sudo docker rmi --force python:3.7 > /dev/null 2>&1
    stop_spinner $?
fi