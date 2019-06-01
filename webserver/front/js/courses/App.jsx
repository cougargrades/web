import React, { Component } from 'react';
import CGSearchForm from './CGSearchForm.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <CGSearchForm hookQuery={(t) => {
        console.log(t)
      }}/>
    );
  }
}

export default App;