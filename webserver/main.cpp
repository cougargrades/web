#include <pistache/endpoint.h>
#include <nlohmann/json.hpp>
#include <csv.h>
#include <iostream>
#include <string>

using namespace Pistache;
using json = nlohmann::json;
using std::cout;
using std::endl;
using std::string;

struct HelloHandler : public Http::Handler {
  HTTP_PROTOTYPE(HelloHandler)
  void onRequest(const Http::Request&, Http::ResponseWriter writer) override {
    cout << "onRequest: Hello, World!" << endl;
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

int main(int argc, char* argv[]) {
  cout << "Starting service listener." << endl;
  //Http::listenAndServe<HelloHandler>("*:9080");

  if(argc < 2) {
    cout << "Usage: " << argv[0] << " [csv files] " << endl;
    exit(0);
  }

  for(int i = 1; i < argc; i++) {
    cout << argv[i] << endl;

    // TERM,SUBJECT,"CATALOG NBR","CLASS SECTION","COURSE DESCR","INSTR LAST NAME","INSTR FIRST NAME",A,B,C,D,F,"TOTAL DROPPED","AVG GPA"
    // "Fall 2018",AAS,2320,7,"Intro To African American Stdy",Horne,Gerald,3,9,2,1,0,0,2.823

    io::CSVReader<14, io::trim_chars<' '>, io::double_quote_escape<',','\"'>, io::single_line_comment<'#'>> in(argv[i]);
    in.read_header(io::ignore_extra_column, "TERM","SUBJECT","CATALOG NBR","CLASS SECTION","COURSE DESCR","INSTR LAST NAME","INSTR FIRST NAME","A","B","C","D","F","TOTAL DROPPED","AVG GPA");

    string term;
    string subject;
    string catalog_number;
    string class_section;
    string course_description;
    string instructor_last_name;
    string instructor_first_name;
    string num_A;
    string num_B;
    string num_C;
    string num_D;
    string num_F;
    string num_Q;
    string average_GPA;

    int n = 0;
    while(in.read_row(term, subject, catalog_number, class_section, course_description, instructor_last_name, instructor_first_name, num_A, num_B, num_C, num_D, num_F, num_Q, average_GPA)) {
      // do stuff with the data
      //cout << average_GPA << endl;
      n++;
    }
    cout << n << endl;
  }
}