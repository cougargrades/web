# Dockerfile
FROM mariadb:latest
RUN apt-get -qq update && apt-get -qq install -y pv
COPY records.sql /opt
COPY ./mariadb/create.sh /opt
COPY ./mariadb/fork.sh /docker-entrypoint-initdb.d

# /docker-entrypoint-initdb.d