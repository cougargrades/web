# Dockerfile
FROM mariadb:latest
COPY ./docker/mariadb/create.sql /docker-entrypoint-initdb.d/
COPY records.sql /docker-entrypoint-initdb.d/