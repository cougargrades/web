#!/bin/bash

# pistache.io dependency build script
git clone https://github.com/oktal/pistache.git
cd pistache
# use commit that this project was designed with
git checkout 86a3e712cd34e87f23bcf71b4df983e0d1322745
# grab submodules
git submodule update --init
mkdir -p {build,prefix}
cd build
# generate makefile
cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DPISTACHE_BUILD_EXAMPLES=false -DPISTACHE_BUILD_TESTS=false -DPISTACHE_BUILD_DOCS=false -DPISTACHE_USE_SSL=false -DCMAKE_INSTALL_PREFIX=$PWD/../prefix ../
# compile and install to pistache/prefix
make -j
make install