#!/bin/bash

cd /opt/importer/

# dependency
chmod +x spinner.sh
export TERM="xterm-256color"
source "$(pwd)/spinner.sh"

# install python shit
start_spinner "[$1] apt-get update"
apt-get update > /dev/null 2>&1
stop_spinner $?
start_spinner "[$1] apt-get install sqlite3 tree -y"
apt-get install sqlite3 tree -y > /dev/null 2>&1
stop_spinner $?
start_spinner "[$1] python3 -m pip install -r requirements.txt"
python3 -m pip install -r requirements.txt --quiet
stop_spinner $?
# start_spinner "python3 -m pipenv install"
# python3 -m pipenv install > /dev/null 2>&1
# stop_spinner $?