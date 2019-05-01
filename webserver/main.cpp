#include <pistache/endpoint.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>

using namespace Pistache;
using json = nlohmann::json;

struct HelloHandler : public Http::Handler {
  HTTP_PROTOTYPE(HelloHandler)
  void onRequest(const Http::Request&, Http::ResponseWriter writer) override {
    std::cout << "onRequest: Hello, World!" << std::endl;
    json j2 = {
      {"pi", 3.141},
      {"happy", true},
      {"name", "Niels"},
      {"nothing", nullptr},
      {"answer", {
        {"everything", 42}
      }},
      {"list", {1, 0, 2}},
      {"object", {
        {"currency", "USD"},
        {"value", 42.99}
      }}
    };
    writer.send(Http::Code::Ok, j2.dump());
  }
};

int main() {
  std::cout << "Starting service listener." << std::endl;
  Http::listenAndServe<HelloHandler>("*:9080");
}