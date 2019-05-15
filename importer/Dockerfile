# Dockerfile
FROM python:3.7-alpine

# Create app directory
WORKDIR '/opt/databaseimport/'

COPY . .

CMD ["sh", "-c", "python3 -m pip install pipenv; python3 -m pipenv install; python3 -m pipenv run ./csv2db.py; python3 -m pipenv run ./db2maria.py; echo server starting; python3 -m http.server 800 & sleep 60; killall python3"]