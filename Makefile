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

up: FORCE
	sudo SOURCE_COMMIT=$$(git rev-parse HEAD) docker-compose up

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

devwebserver: devwebserverprep up FORCE

devwebserverprep: FORCE
	sudo docker stop cougar-grades.webserver
	sudo docker rm cougar-grades.webserver
	sudo docker rmi cougar-grades.webserver
	sudo docker-compose build webserver

devwebserverupd: FORCE
	sudo docker-compose up -d --build webserver
	sudo docker attach --sig-proxy=false cougar-grades.webserver

devwebserverswap: FORCE
	sudo docker cp ./webserver cougar-grades.webserver:/opt/cougargrades
	sudo docker restart cougar-grades.webserver
	sudo docker attach --sig-proxy=false cougar-grades.webserver

FORCE: 
