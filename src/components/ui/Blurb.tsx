import React, { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

type BlurbProps = {
  http404?: boolean;
  children?: React.ReactNode;
};

export function Blurb(props: BlurbProps) {
  const location = useLocation();
  const styles: CSSProperties = {
    textAlign: 'center',
    paddingTop: '15px',
  };

  return (
    <div style={styles}>
      {props.http404 ? (
        <p>
          The requested URL <code>{location.pathname}</code> was not found.
        </p>
      ) : (
        props.children
      )}
    </div>
  );
}
