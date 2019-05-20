# Dockerfile
FROM node:10-alpine

# Create app directory
WORKDIR '/opt/cougargrades'

COPY ./webserver .
COPY ./records.db .

CMD ["sh", "-c", "npm install && npm start"]
