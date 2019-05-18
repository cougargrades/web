# Dockerfile
FROM mariadb:latest
RUN apt-get -qq update && apt-get -qq install -y pv
COPY records.sql /opt
COPY ./docker/mariadb/create.sh /opt
COPY ./docker/mariadb/fork.sh /docker-entrypoint-initdb.d

# /docker-entrypoint-initdb.d