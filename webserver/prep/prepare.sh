#!/bin/sh

echo "[prepare.sh] polling for signal\n"
cd /opt/cougargrades/prep
npm install node-fetch # because stdlib nodejs is that horrible
cd -
node /opt/cougargrades/prep/polling.js
echo "[prepare.sh] signal received.\n"

# apt update
# apt install -y mariadb-client

echo "[prepare.sh] Preparing mariadb webserver essentials\n"
mysql -h "cougar-grades.mariadb" -u "root" "-p"$MYSQL_ROOT_PASSWORD -e 'CREATE DATABASE IF NOT EXISTS records;' | true
mysql -h "cougar-grades.mariadb" -u "root" "-p"$MYSQL_ROOT_PASSWORD "records" < /opt/cougargrades/db/records.sql | true
echo "[prepare.sh] Done\n"
