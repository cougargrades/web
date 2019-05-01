# explicitly use c++11
CC = g++ -std=c++11

# compiler flags
CFLAGS= -pedantic -Wall -Wextra

# libraries
INCLUDE=$(PWD)/pistache/prefix/include
LIB=$(PWD)/pistache/prefix/lib
LINK=pistache

.FORCE:

# make scripts
default: main.out
run: main.out
	LD_LIBRARY_PATH=$(LIB) ./main.out
clean:
	$(RM) *.o *.out *.zip
cleandep:
	rm -rf pistache
dep: .FORCE
	./dependencies/pistache.sh

# project source
main.out: main.cpp
	$(CC) $(CFLAGS) -I $(INCLUDE) -L $(LIB) -l $(LINK) $< -o $@ 