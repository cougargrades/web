# cougar-grades
[indev] University of Houston service for students

## Indev ⚠
cougar-grades is in private early development and the master branch will get very dirty as a result. This means commits probably won't work if cloned and tried building.

## Project modules
- `api/` Node.js webserver to run the website using [fastify](https://github.com/fastify/fastify/)
- `importer/` Python script to process a collection of CSV files into .db and .sql files for importing into the webserver module
- `mariadb/` MariaDB Docker image that imports the .sql files produced by `importer/`
- `web/` Nginx Docker image that preprocesses the Sass CSS and {{Mustache}} files for configurable baseurl support

### Database importer
[![asciicast](https://asciinema.org/a/q2sB4WEdl1hiRYR4keoh3AFGw.svg)](https://asciinema.org/a/q2sB4WEdl1hiRYR4keoh3AFGw)

### Webserver
[indev]

## Dependencies
- Docker
- Docker Compose
- `make`
- Grade data (only one is required):
    - in CSV format with the schema seen in `schema/sample.csv`
- At least 1-2GB in space (Docker images are large)

## Running
- `cd cougar-grades/`
- Generate SQLite and SQL files: `./generate.sh [directory with csvfiles | csvfile] --cleanup`
    - `records.db` and a `records.sql` files will be copied to `cougar-grades/` before deleting the container and images generated
- TBD

## Inspiration
- anex.us/grades/ (author unknown)
- AggieScheduler (@jake-leland)
- Good-Bull-Schedules (@SaltyQuetzals)

## Development
- @au5ton
- @fluffthepanda
