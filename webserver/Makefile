# explicitly use c++11
CC = g++ -std=c++11

# compiler flags
CFLAGS= -pedantic -Wall -Wextra

# libraries
# pistache.io headers, binaries, and linking instructions
pistache_INCLUDE=$(PWD)/pistache/prefix/include
pistache_LIB=$(PWD)/pistache/prefix/lib
pistache_LINK=pistache

# json & csv header files
json_INCLUDE=$(PWD)/nlohmann-json/include
csv_INCLUDE=$(PWD)/fast-cpp-csv-parser

# concatenating the library paths
INCLUDE= -I $(pistache_INCLUDE) -I $(json_INCLUDE) -I $(csv_INCLUDE)
LIB= -L $(pistache_LIB)
LINK= -l $(pistache_LINK) -l pthread

.FORCE:
# make scripts
default: main.out
run: main.out
	BASEURL="/cougar" LD_LIBRARY_PATH=$(pistache_LIB) ./main.out
clean:
	$(RM) *.o *.out *.zip
cleandep:
	rm -rf pistache
	rm -rf nlohmann-json
	rm -rf fast-cpp-csv-parser
dep: .FORCE
	./dependencies/pistache.sh
	./dependencies/nlohmann-json.sh
	./dependencies/fast-cpp-csv-parser.sh

# project source
main.out: main.cpp APIEndpoint.o
	$(CC) $(CFLAGS) $(INCLUDE) $(LIB) $(LINK) -o $@ $< $$(ls *.o)

APIEndpoint.o: APIEndpoint.cpp APIEndpoint.h
	$(CC) $(CFLAGS) $(INCLUDE) $(LIB) $(LINK) -c $<