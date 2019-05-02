#include <pistache/http.h>
#include <pistache/router.h>
#include <pistache/endpoint.h>
#include <nlohmann/json.hpp>
#include <csv.h>
#include <iostream>
#include <string>
#include <chrono>
#include <cstdlib>
#include <csignal>

#include "APIEndpoint.h"

using namespace Pistache;
using json = nlohmann::json;
using std::cout;
using std::endl;
using std::string;

APIEndpoint* ptr = nullptr;
void signalHandler(int signum) {
  cout << "Interrupt signal (" << signum << ") received.\n";  
  ptr->shutdown();
  exit(signum);  
}

int main() {
  //signal(SIGINT, signalHandler);
  cout << "Starting server..." << endl;
  
  string baseurl;
  if(const char* env_baseurl = std::getenv("BASEURL")) {
    baseurl = env_baseurl;
    cout << "ENV[BASEURL] => " << baseurl << endl;
  }

  Port port(9080);

  int thr = 2;

  Address addr(Ipv4::any(), port);

  cout << "Cores = " << hardware_concurrency() << endl;
  cout << "Using " << thr << " threads" << endl;

  APIEndpoint server(addr, baseurl);
  ptr = &server;

  server.init(thr);
  server.start();
  server.shutdown();
}