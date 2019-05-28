#!/bin/bash
cd "$(dirname "$0")"

# generated files
mkdir _site

# mustache generate
echo "console.log(JSON.stringify(process.env))" | node - > env.json
for f in mustache/*.mustache; do 
    npx run mustache -p mustache/partials/*.mustache /opt/env.json $f > _site/$(basename $f .mustache).html
done

# sass generate
npx run sass sass/:_site/css/

# copy already static files
cp -r static/* _site/

mkdir -p ".$BASEURL"
mv _site/* ".$BASEURL"
mv ".$BASEURL" _site/

tree _site