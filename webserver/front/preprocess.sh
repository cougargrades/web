#!/bin/bash
cd "$(dirname "$0")"

# generated files
mkdir -p _site

# mustache generate
echo "
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '..', '.env')})
console.log(JSON.stringify(process.env))" | node - > env.json
for f in mustache/*.mustache; do 
    npx mustache -p mustache/partials/*.mustache env.json $f > _site/$(basename $f .mustache).html
done

# sass generate
npx sass sass/:_site/css/

# copy already static files
cp -r static/* _site/

#  cleanup
rm env.json

# display
tree _site