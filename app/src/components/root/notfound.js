import React, { Component } from 'react';

import { withRouter } from "react-router";

const styles = {
    textAlign: 'center',
    paddingTop: '15px'
};

class NotFound extends Component {
    //this.props.location.pathname
    render() {
        return (
            <div style={styles}>
                <p>The requested URL <code>{this.props.location.pathname}</code> was not found.</p>
            </div>
        );
        
    }
}

export default withRouter(NotFound);