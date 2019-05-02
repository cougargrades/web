
#include "APIEndpoint.h"

using namespace Pistache;

void APIEndpoint::setupRoutes() {
    using namespace Rest;
    Routes::Get(router, baseurl+"/", Routes::bind(&APIEndpoint::handleReady, this));
}

void APIEndpoint::handleReady(const Rest::Request&, Http::ResponseWriter response) {
    response.send(Http::Code::Ok, "Hello, API!");
}