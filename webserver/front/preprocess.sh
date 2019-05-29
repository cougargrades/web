#!/bin/bash
cd "$(dirname "$0")"

# generated files
mkdir -p _site

# handlebars
node generate_html.js

# sass generate
npx sass sass/:_site/css/

# copy already static files
cp -r static/* _site/

#  cleanup
rm env.json

# display
tree _site