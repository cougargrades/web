# Dockerfile
FROM node:10

# Create app directory
WORKDIR '/opt/cougargrades'

COPY ./webserver .
COPY ./records.db .

CMD ["sh", "-c", "npm install && npm start"]
