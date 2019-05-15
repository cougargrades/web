# Dockerfile
FROM node:10

# Create app directory
WORKDIR '/opt/cougargrades'

COPY . .

CMD ["sh", "-c", "apt update && apt install -y mariadb-client; /opt/cougargrades/prep/prepare.sh; npm install && npm start"]
