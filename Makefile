
default: main

main: build run FORCE

daemon: build rund FORCE

fresh: clean main FORCE

clean: stop prune FORCE

stop: FORCE
	sudo docker stop cougar-grades.webserver cougar-grades.importer cougar-grades.cache cougar-grades.mariadb | true

prune: FORCE
	sudo docker rm --volumes cougar-grades.webserver cougar-grades.importer cougar-grades.cache cougar-grades.mariadb | true
	M = $$(docker ps -a -q --filter "name=cougar")
	MS = $$(echo "$M" | tr '\n' ' ')
	echo $(MS)
	sudo docker rmi --force $(sudo docker images -q 'cougar-grades*' | uniq) | true

build: FORCE
	sudo docker build -t cougar-grades.webserver webserver/
	sudo docker build -t cougar-grades.importer importer/

run: FORCE
	sudo docker-compose up --build

rund: FORCE
	sudo docker-compose up -d

# debugging
webserver: FORCE
	sudo docker build -t cougar-grades.webserver webserver/
	sudo docker run --name make_temp cougar-grades.webserver 
	sudo docker container rm --volumes make_temp

FORCE: 

# "scripts": {
#     "build": "npx sass --update $npm_package_config_sass_src:$npm_package_config_sass_dest",
#     "server": "node --max-old-space-size=2048 server.js",
#     "start": "npm run build && npm run server",
#     "sasswatch": "npx sass --watch $npm_package_config_sass_src:$npm_package_config_sass_dest",
#     "nodewatch": "npx nodemon --ignore assets/ --exec node --inspect=0.0.0.0:9229 server.js",
#     "test": "npm run sasswatch & npm run nodewatch",
#     "docker": "npm run docker:build && npm run docker:run",
#     "docker:fresh": "npm run docker:stop && npm run docker:prune && npm run docker",
#     "docker:stop": "sudo docker stop cougar-grades.webserver cougar-grades.cache cougar-grades.mariadb",
#     "docker:prune": "sudo docker container rm --volumes cougar-grades.webserver cougar-grades.cache cougar-grades.mariadb",
#     "docker:build": "sudo docker build -t au5ton/cougar-grades .",
#     "docker:run": "sudo docker-compose up --build",
#     "docker:run-old": "sudo docker run -p $npm_package_config_server_port:3070 au5ton/cougar-grades"
#   },