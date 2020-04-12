import React from 'react'
import { useLocation } from 'react-router'

export const Brand: React.FC = () => {
  const location = useLocation()

  if (location.pathname === '/' || location.pathname === '/about')
    return <><i style={{fontSize: 'inherit'}} className="material-icons">school</i></>;
  else
    return <>CougarGrades.io</>;
}