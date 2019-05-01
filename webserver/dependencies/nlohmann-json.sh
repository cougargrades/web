#!/bin/bash

# nlohmann/json dependency build script
wget https://github.com/nlohmann/json/releases/download/v3.6.1/include.zip -O nlohmann-json.zip
unzip nlohmann-json.zip -d nlohmann-json
rm nlohmann-json.zip