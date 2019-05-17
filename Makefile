# meta
default: main

main: build up FORCE

# importer (independent)
importer: FORCE
	sudo docker rm --force $$(docker ps -q -f 'ancestor=au5ton/cougar-grades.importer') | true
	sudo docker rmi --force au5ton/cougar-grades.importer | true
	sudo docker build -t au5ton/cougar-grades.importer importer/

# daemon management
daemon: down build upd FORCE

start: FORCE
	sudo docker-compose start

stop: FORCE
	sudo docker-compose stop

build: FORCE
	sudo docker-compose build --parallel

# development management
fresh: down main FORCE

up: build FORCE
	sudo docker-compose up

upd: FORCE
	sudo docker-compose up -d

down: FORCE
	sudo docker-compose down --rmi all
	sudo docker ps -a
	sudo docker images

# dev tools only
devls: FORCE
	sudo docker ps -all
	sudo docker images

devmariadb: devmariadbdown devmariadbup FORCE

devmariadbdown: FORCE
	sudo docker-compose down --rmi all
devmariadbup: FORCE
	sudo docker-compose up --build mariadb


FORCE: 
