import React, { Component } from 'react';

import CGSearchForm from './form/CGSearchForm.jsx';
import CGCourseResults from './results/CGCourseResults.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: []
    };
  }

  handleQuery(selection) {
    console.log('query handled: ',selection)
    this.setState({
      selection: selection.slice()
    })
  }

  render() {
    return (
      <div>
        <CGSearchForm onQuery={(val) => this.handleQuery(val)}/>
        <CGCourseResults selection={this.state.selection} />
      </div>
    );
  }
}

export default App;