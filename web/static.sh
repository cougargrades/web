#!/bin/bash

# generated files
mkdir _site

# mustache generate
export baseurl=$WEBSERVER_BASEURL
echo "console.log(JSON.stringify(process.env))" | node - > /opt/env.json
for f in mustache/*.mustache; do 
    mustache /opt/env.json $f > _site/$(basename $f .mustache).html
done

# sass generate
sass sass/:_site/css/

tree _site