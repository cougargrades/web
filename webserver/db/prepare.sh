#!/bin/sh

dpkg -l | grep mariadb-client
RESULT=$?

# if already installed
if [ $RESULT -eq 0 ]; then
    printf "[prepare.sh] Mariadb already installed. No prep to be done.\n"
    exit
fi

apt update
apt install -y mariadb-client

printf "[prepare.sh] Preparing mariadb webserver essentials\n"
mysql -h "cougar-grades.mariadb" -u "root" "-p"$MYSQL_ROOT_PASSWORD -e 'CREATE DATABASE records;'
mysql -h "cougar-grades.mariadb" -u "root" "-p"$MYSQL_ROOT_PASSWORD "records" < /opt/cougargrades/db/records.sql
printf "[prepare.sh] Done\n"
