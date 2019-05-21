#!/bin/bash
cd /opt/web/

# generated files
mkdir _site

# mustache generate
echo "console.log(JSON.stringify(process.env))" | node - > /opt/env.json
for f in mustache/*.mustache; do 
    mustache /opt/env.json $f > _site/$(basename $f .mustache).html
done

# sass generate
sass sass/:_site/css/

# copy already static files
cp -r static/* _site/

# nginx configuration generate
mustache /opt/env.json nginx/default.conf.mustache > nginx/default.conf

mkdir -p ".$BASEURL"
mv _site/* ".$BASEURL"
mv ".$BASEURL" _site/

tree _site