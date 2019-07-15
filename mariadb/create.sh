#!/bin/bash

# pv /opt/records.sql | mysql -u root -p${MYSQL_ROOT_PASSWORD} records

# block thread until lock is removed by /docker-entrypoint-initdb.d script
sleep 5
printf "[create.sh] Waiting for socket to be ready.."
RESULT="1"
while [ "$RESULT" != "0" ]; do
    X=$(mysql -u root -p${MYSQL_ROOT_PASSWORD} -e 'help;')
    printf "."
    RESULT=$?
    sleep 2
done
printf "\n"

echo "Importing /opt/records.sql"
pv --numeric /opt/records.sql | mysql --wait -u root -p${MYSQL_ROOT_PASSWORD} records