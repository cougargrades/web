import React from 'react';

import './progress.scss';

// See: https://getbootstrap.com/docs/5.0/customize/color/
export type ProgressColorVariants = 'bg-primary' | 'bg-secondary' | 'bg-success' | 'bg-danger' | 'bg-warning' | 'bg-info' | 'bg-light' | 'bg-dark' |
'bg-blue' | 'bg-indigo' | 'bg-purple' | 'bg-pink' | 'bg-red' | 'bg-orange' | 'bg-yellow' | 'bg-green' | 'bg-teal' | 'bg-cyan' | 'bg-gray-500' | 'bg-black' | 'bg-white';

/**
 * React wrapper for Bootstrap@5.0.0 progress bar
 * Adapted from: https://getbootstrap.com/docs/5.0/components/progress/
 */
export function Progress(props: { value: number, max: number, variant: ProgressColorVariants, children?: React.ReactNode }) {
  const { value, max, variant } = props;
  return (
    <div className="progress">
      <div className={`progress-bar progress-bar-striped progress-bar-animated ${variant}`} role="progressbar" style={{width: `${value/max * 100}%`}}>
        {props.children}
      </div>
    </div>
  );
}

export type MultiBar = { key: React.Key, value: number, variant: ProgressColorVariants };

/**
 * React wrapper for Bootstrap@5.0.0 progress bar
 * Adapted from: https://getbootstrap.com/docs/5.0/components/progress/
 */
 export function MultiProgress(props: { bars: MultiBar[], max: number }) {
  const { bars, max } = props;
  return (
    <div className="progress">
      {
        bars.map(e => 
          <div key={e.key} className={`progress-bar progress-bar-striped progress-bar-animated ${e.variant}`} role="progressbar" style={{width: `${e.value/max * 100}%`}}>
            {e.value}
          </div>
        )
      }
    </div>
  );
}