#!/usr/bin/env ruby
for x in 0..200
    system("curl -sSL -D - 10.8.0.1:3000/grades/api/table/all/COSC/1304 -o /dev/null | grep -E \"HTTP|x-response-time\"")
end
