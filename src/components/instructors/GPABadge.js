import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './GPABadge.scss';

class GPABadge extends Component {

    color(n) {
        // 4.0 is rarely scored in practice
        if (n > 3.5) return 'grade-a'
        if (n > 2.5) return 'grade-b'
        if (n > 1.5) return 'grade-c'
        // 1.0 is rarely scored in practice
        if (n < 1.5) return 'grade-d'
        if (n < 0.5) return 'grade-f'
        return 'grade-i'
    }

    /**
     * For the standardDeviation values of all instructors (latest data: Summer 2019)
     * ===================================================
     * min: 0.0007071067811864697
     * mean: 0.28632900784232573
     * median: 0.24911322128640845
     * max: 1.6836212460051696
     * 
     * Interpretations:
     * ===============
     * - 25% likely to have stddev under 0.149
     * - 50% likely to have stddev under 0.286
     * - 75% likely to have stddev under 0.425
     * 
     * Color ranges:
     * ============
     * sigma < 0.149 
     */
    sd_color(sd) {
        if (sd < 0.149) return 'grade-a'
        if (sd < 0.286) return 'grade-b'
        if (sd < 0.425) return 'grade-c'
        if (sd > 0.425) return 'grade-d'
        return 'grade-i'
    }

    caption(n) {
        if (n > 3.5) return 'A average'
        if (n > 2.5) return 'B average'
        if (n > 1.5) return 'C average'
        // 1.0 is rarely scored in practice
        if (n < 1.5) return 'D average'
        if (n < 0.5) return 'F average'
        return ''
    }

    render() {
        return (
            <>
                <span className={`gpa-badge ${this.color(this.props.value)}`}>{`${this.props.value.toFixed(2)} GPA`}</span>
                <span className={`gpa-badge-caption ${this.color(this.props.value)}-text`} >{this.props.caption ? this.caption(this.props.value) : ''}</span>
                <span className={`gpa-badge stddev ${this.sd_color(this.props.stddev)}`} title="standard deviation">{this.props.stddev ? `${this.props.stddev.toFixed(2)} SD` : ''}</span>
            </>
        )
    }
}

GPABadge.propTypes = {
    value: PropTypes.number.isRequired
};

export default GPABadge;