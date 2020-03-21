import React, { Component } from 'react';
import { withRouter } from 'react-router';

const styles = {
    textAlign: 'center',
    paddingTop: '15px'
};

class Blurb extends Component {
    render() {
        return (
            <div style={styles}>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(Blurb);