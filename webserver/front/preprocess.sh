#!/bin/bash
cd "$(dirname "$0")"

# generated files
mkdir -p _site

# copy already static files
cp -r static/* _site/