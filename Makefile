# meta
default: main

main: start FORCE

# importer (independent)
importer: FORCE
	sudo docker rm --force $$(docker ps -q -f 'ancestor=au5ton/cougar-grades.importer') | true
	sudo docker rmi --force au5ton/cougar-grades.importer | true
	sudo docker build -t au5ton/cougar-grades.importer importer/

start:
	sudo docker-compose up --build -d

stop:
	sudo docker-compose down --rmi all

# dev tools only
devls: FORCE
	sudo docker ps -all
	sudo docker images

FORCE: 
