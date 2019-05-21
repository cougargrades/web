# Dockerfile
FROM node:10-alpine

# Create app directory
WORKDIR '/opt/cougargrades'

COPY ./api .
COPY ./records.db .

RUN apk --update add alpine-sdk build-base libc-dev gcc g++ git bash python make sqlite curl
RUN npm install
CMD bash -c './entry.sh'
