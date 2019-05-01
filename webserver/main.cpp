#include <pistache/endpoint.h>
#include <iostream>
#include <string>

using namespace Pistache;

struct HelloHandler : public Http::Handler {
  HTTP_PROTOTYPE(HelloHandler)
  void onRequest(const Http::Request&, Http::ResponseWriter writer) override {
    std::cout << "onRequest: Hello, World!" << std::endl;
    writer.send(Http::Code::Ok, "Hello, World!");
  }
};

int main() {
  std::cout << "Starting service listener." << std::endl;
  Http::listenAndServe<HelloHandler>("*:9080");
}