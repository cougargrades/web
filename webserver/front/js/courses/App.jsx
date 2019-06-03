import React, { Component } from 'react';
import CGSearchForm from './CGSearchForm.jsx';
import CGCourseResults from './CGCourseResults.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hookQuery(selection) {

  }

  render() {
    return (
      <div>
        <CGSearchForm hookQuery={this.hookQuery}/>
        <CGCourseResults />
      </div>
    );
  }
}

export default App;