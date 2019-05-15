# cougar-grades

## Project modules
- `webserver/` Node.js webserver to run the website using [fastify](https://github.com/fastify/fastify/)
- `database/` Python script to create the sqlite3 database from a collection of CSV files

## Webserver
### Dependencies
- Node.js 10.x.x
### Running
- `cd webserver/`
- `npm install`
- `npm start`

## Database creator
[![asciicast](https://asciinema.org/a/243852.svg)](https://asciinema.org/a/243852)

### Dependencies
- Python 3.6+ (you should already have this installed)
- pip
### Running
- `pip install pipenv`: easy virtual environments
- `pipenv install`: install pip dependencies to a project-only virtual environment
- `pipenv run ./csv2db.py [csv files ...]`: run with virtual environment
- Alternatively, there is a `requirements.txt` file for pure pip users


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
