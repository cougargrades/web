#!/bin/bash
# Install curl and pup
# pup: https://github.com/ericchiang/pup

## declare an array variable
declare -a arr=(
  "http://localhost:3000/c/MATH%203339"
  "http://localhost:3000/c/ENGL%201302"
  "http://localhost:3000/i/Long,%20Kevin%20B"
  "http://localhost:3000/i/Breslin,%20Whitney%20L"
  "http://localhost:3000/i/Rizk,%20Nouhad%20J"
  "http://localhost:3000/g/10"
  "http://localhost:3000/g/10-13121"
  "http://localhost:3000/g/all-subjects"
  "http://localhost:3000/g/college-engineering"
  )

## now loop through the above array
for i in "${arr[@]}"
do
  curl -s "$i" | pup 'title, meta[name=description]'
  echo "- - - - - - - - - - - - - - -"
done
