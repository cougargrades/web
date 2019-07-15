#!/bin/bash
cd /opt/importer/

export TERM="xterm-256color"
source "$(pwd)/spinner.sh"

wget --quiet https://raw.githubusercontent.com/au5ton/SQLite-to-MariaDB-MySQL-perl-script/master/sqlite-to-mariadb.pl
chmod +x sqlite-to-mariadb.pl

start_spinner "[$1] .db ==> .sqlite"
sqlite3 records.db -cmd ".output records.sqlite.sql" ".dump"
stop_spinner $?
start_spinner "[$1] .sqlite ==> .mariadb"
perl sqlite-to-mariadb.pl records.sqlite.sql > records.sql
# replace "records" with records in table creation line
python << END
with open('records.sql', 'r') as reader:
    lines = reader.readlines()

with open('records.sql', 'w') as writer:
    for e in lines:
        writer.write(e.replace("\"records\"","records"))
END
# prepend file
cat <(echo "
SET autocommit=0;
SET unique_checks=0;
SET foreign_key_checks=0;
") records.sql > records.sql.tmp
# replaces with temporary file
rm records.sql
mv records.sql.tmp records.sql
# append to file
echo "
COMMIT;
SET unique_checks=1;
SET foreign_key_checks=1;
" >> records.sql

stop_spinner $?
