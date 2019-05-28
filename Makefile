# meta
default: main

main: build up FORCE

# importer (independent)
importer: FORCE
	sudo docker rm --force $$(docker ps -q -f 'ancestor=au5ton/cougar-grades.importer') | true
	sudo docker rmi --force au5ton/cougar-grades.importer | true
	sudo docker build -t au5ton/cougar-grades.importer importer/

# dev tools only
devls: FORCE
	sudo docker ps -all
	sudo docker images


FORCE: 
