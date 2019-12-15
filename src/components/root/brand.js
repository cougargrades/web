import React, { Component } from 'react';

import { withRouter } from "react-router";

import School from '@material-ui/icons/School';

class Brand extends Component {
    render() {
        if(this.props.location.pathname === '/' || this.props.location.pathname === '/about')
            return <School />;
        else
            return <>CougarGrades.io</>;
    }
}

export default withRouter(Brand);