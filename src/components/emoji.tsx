import React from 'react';

interface EmojiProps {
  label: string;
  symbol: string;
}

export const Emoji: React.FC<EmojiProps> = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
);
