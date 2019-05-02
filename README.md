# cougar-grades

## Project modules
- `webserver/` Node.js webserver to run the website using [fastify](https://github.com/fastify/fastify/)
- `database/` Python script to create the sqlite3 database from a collection of CSV files

## Building and running
### Webserver dependencies
- Node.js 10.x.x
### Webserver running
- `cd webserver/`
- `npm install`
- `npm start`

### Database creator dependencies
- Python 3.6+ (you should already have this installed)
- pip
### Database creator running
- `pip install pipenv`: easy virtual environments
- `pipenv install`: install pip dependencies to a project-only virtual environment
- `pipenv run ./csv2db.py [csv files ...]`: run with virtual environment
- Alternatively, there is a `requirements.txt` file for pure pip users