# cougar-grades
[indev] University of Houston service for students

## Project modules
- `webserver/` Node.js webserver to run the website using [fastify](https://github.com/fastify/fastify/)
- `importer/` Python script to process a collection of CSV files into the MariaDB database

### Database importer
[![asciicast](https://asciinema.org/a/243852.svg)](https://asciinema.org/a/243852)

### Webserver
[![webserver](https://thumbs.gfycat.com/ShimmeringEverlastingIbis-size_restricted.gif)](https://gfycat.com/shimmeringeverlastingibis)

## Dependencies
- Docker
- Docker Compose
- `make`
- Grade data in CSV format with the schema seen in `sample.csv` 
- At least 1-1.5GB in space (Docker images large)

## Running
- Copy your CSV files into `importer/payload/`
- cd `cougar-grades/`
- *Start containers in the background:* `make daemon`
- *Start containers interactively:* `make`

## Inspiration
- anex.us/grades/ (author unknown)
- AggieScheduler (@jake-leland)
- Good-Bull-Schedules (@SaltyQuetzals)

## Development
- @au5ton
- @fluffthepanda


### Docker
- install docker-ce
- install docker-compose
- install make
- put csv files in `payload/`
