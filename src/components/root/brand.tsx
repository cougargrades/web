import React from 'react';
import { useLocation } from 'react-router';

export const Brand: React.FC = () => {
  const location = useLocation();

  //return <><i className="material-icons">school</i></>

  if (location.pathname === '/' || location.pathname === '/about')
    return <>🎓</>;
  else return <>CougarGrades.io</>;
};
