# cougar-grades


## Project modules
- `webserver/` C++11 webserver to run the website using [pistache.io](http://pistache.io/)
- `mysql/`

## Building and running
### Dependencies
- `git`
- `cmake`
- `g++` >= 4.7.x
- `wget`
- `unzip`
- Any operating system not Windows

### Building
- `cd webserver/`
- `make dep`: Download and install C++ libraries used, invididual build scripts per-library found in `webserver/dependencies/`
- `make`: Compile cougar-grades

### Running
- `make run`: Run cougar-grades with configration file `config.json`