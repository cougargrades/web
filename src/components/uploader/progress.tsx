import React from 'react';

import './progress.scss';

/**
 * React wrapper for Bootstrap@5.0.0 progress bar
 * Adapted from: https://getbootstrap.com/docs/5.0/components/progress/
 */
export function Progress(props: { value: number, max: number, children?: React.ReactNode }) {
  const { value, max } = props;
  return (
    <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${value/max * 100}%`}}>
        {props.children}
      </div>
    </div>
  );
}
