#ifndef ENDPOINTS_H
#define ENDPOINTS_H

#include <algorithm>
#include <string>

#include <pistache/http.h>
#include <pistache/router.h>
#include <pistache/endpoint.h>

using namespace std;
using namespace Pistache;

class APIEndpoint {
public:
    APIEndpoint(Address addr) : httpEndpoint(std::make_shared<Http::Endpoint>(addr)), baseurl("") { }
    APIEndpoint(Address addr, string baseurl) : httpEndpoint(std::make_shared<Http::Endpoint>(addr)), baseurl(baseurl) { }

    void init(size_t thr = 2) {
        auto opts = Http::Endpoint::options()
            .threads(thr);
            //.flags(Tcp::Options::InstallSignalHandler);
        httpEndpoint->init(opts);
        setupRoutes();
    }

    void start() {
        httpEndpoint->setHandler(router.handler());
        httpEndpoint->serve();
    }

    void shutdown() {
        httpEndpoint->shutdown();
    }

private:
    void setupRoutes();
    void handleReady(const Rest::Request&, Http::ResponseWriter response);

    std::shared_ptr<Http::Endpoint> httpEndpoint;
    Rest::Router router;
    string baseurl;
};

#endif