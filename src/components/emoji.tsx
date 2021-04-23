import React from 'react';

export default function Emoji(props: { label: string, symbol: string } & Partial<React.HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ''}
      aria-hidden={props.label ? 'false' : 'true'}
      {...props}
    >
      {props.symbol}
    </span>
  );
}
