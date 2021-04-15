import React from 'react';

import './button.scss';

type ButtonVariants = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'adaptive';
type ButtonSizes = 'lg' | 'sm' | undefined;

type ButtonProps = {
  variant: ButtonVariants,
  size?: ButtonSizes,
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
      {props.children}
    </button>
  );
}
