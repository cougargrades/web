# cougar-grades
[indev] University of Houston service for students

## Indev ⚠
cougar-grades is in private early development and the master branch will get very dirty as a result. This means commits probably won't work if cloned and tried building.

## Project modules
- `webserver/` Node.js webserver to run the website using [fastify](https://github.com/fastify/fastify/)
- `importer/` Python script to process a collection of CSV files into the MariaDB database

### Database importer
[![asciicast](https://asciinema.org/a/q2sB4WEdl1hiRYR4keoh3AFGw.svg)](https://asciinema.org/a/q2sB4WEdl1hiRYR4keoh3AFGw)

<!-- ### Webserver
 [![webserver](https://thumbs.gfycat.com/ShimmeringEverlastingIbis-size_restricted.gif)](https://gfycat.com/shimmeringeverlastingibis) -->

## Dependencies
- Docker
- Docker Compose
- `make`
- Grade data (only one is required):
    - in CSV format with the schema seen in `schema/sample.csv`
- At least 1-2GB in space (Docker images large)

## Running
- cd `cougar-grades/`
- Build importer docker image: `make importer`
- Generate SQLite and SQL files: `./export-sql.sh load [directory with csvfiles | csvfile]`
- A `records.db` and a `records.sql` file will be available.

## Inspiration
- anex.us/grades/ (author unknown)
- AggieScheduler (@jake-leland)
- Good-Bull-Schedules (@SaltyQuetzals)

## Development
- @au5ton
- @fluffthepanda
