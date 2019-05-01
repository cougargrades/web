# explicitly use c++11
CC = g++ -std=c++11

# compiler flags
CFLAGS= -pedantic -Wall -Wextra

# libraries
pistache_INCLUDE=$(PWD)/pistache/prefix/include
pistache_LIB=$(PWD)/pistache/prefix/lib
pistache_LINK=pistache

json_INCLUDE=$(PWD)/nlohmann-json/include
# json_LIB=$(PWD)/pistache/prefix/lib
# json_LINK=pistache

INCLUDE= -I $(pistache_INCLUDE) -I $(json_INCLUDE)
LIB= -L $(pistache_LIB)
LINK= -l $(pistache_LINK)

.FORCE:

# make scripts
default: main.out
run: main.out
	LD_LIBRARY_PATH=$(pistache_LIB) ./main.out
clean:
	$(RM) *.o *.out *.zip
cleandep:
	rm -rf pistache
	rm -rf nlohmann-json
dep: .FORCE
	./dependencies/pistache.sh
	./dependencies/nlohmann-json.sh

# project source
main.out: main.cpp
	$(CC) $(CFLAGS) $(INCLUDE) $(LIB) $(LINK) $< -o $@ 