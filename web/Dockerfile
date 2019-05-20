# Dockerfile
FROM node:10-alpine
WORKDIR '/opt/web/'
COPY ./web .
ARG WEBSERVER_BASEURL
RUN npm config set unsafe-perm true
RUN npm install -g mustache
RUN npm install -g sass
RUN apk add bash tree
RUN bash -c './static.sh'

FROM nginx:latest 
WORKDIR /root/
COPY --from=0 /opt/web/_site /var/www
# CMD nginx  
