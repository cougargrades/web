# Dockerfile
FROM node:10-alpine
WORKDIR '/opt/web/'
COPY ./web .
ARG BASEURL
RUN npm config set unsafe-perm true
RUN npm install -g mustache
RUN npm install -g sass
RUN apk add bash tree
RUN bash -c './preprocess.sh'

FROM nginx:latest 
WORKDIR /root/
COPY --from=0 /opt/web/_site /usr/share/nginx/html
COPY --from=0 /opt/web/nginx/default.conf /etc/nginx/conf.d/
RUN mkdir -p /tmp/nginx/cache
# CMD nginx  
