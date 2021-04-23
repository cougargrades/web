import React from 'react';

import './button.scss';

type ButtonVariants = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'adaptive';
type ButtonSizes = 'lg' | 'sm' | undefined;

type ButtonProps = {
  variant: ButtonVariants,
  size?: ButtonSizes,
  //loading?: boolean,
  children?: React.ReactNode
}


/**
 * React wrapper for Bootstrap@5.0.0 button
 * Adapted from: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export function Button(props: ButtonProps & Partial<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>) {
  const { variant, size } = props;
  return (
    <button {...props} className={`btn btn-${variant}${size !== undefined ? ` btn-${size}` : ''}`} type="button">
      {/* { props.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <></> } */}
      {props.children}
    </button>
  );
}

/**
 * React wrapper for Bootstrap@5.0.0 button
 * Adapted from: https://getbootstrap.com/docs/5.0/components/buttons/
 */
export function LinkButton(props: ButtonProps & Partial<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>) {
  const { variant, size } = props;
  return (
    <a {...props} className={`btn btn-${variant}${size !== undefined ? ` btn-${size}` : ''}`} role="button">
      {/* { props.loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <></> } */}
      {props.children}
    </a>
  );
}
