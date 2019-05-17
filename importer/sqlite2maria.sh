#!/bin/bash
cd /opt/importer/

export TERM="xterm-256color"
source "$(pwd)/spinner.sh"

wget --quiet https://raw.githubusercontent.com/NotoriousPyro/SQLite-to-MariaDB-MySQL-perl-script/master/sqlite-to-mariadb.pl
chmod +x sqlite-to-mariadb.pl

start_spinner "[$1] .db ==> .sqlite"
sqlite3 records.db -cmd ".output records.sqlite.sql" ".dump"
stop_spinner $?
start_spinner "[$1] .sqlite ==> .mariadb"
perl sqlite-to-mariadb.pl records.sqlite.sql > records.sql
stop_spinner $?
