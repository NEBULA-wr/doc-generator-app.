import React from 'react';
import './Card.css';

const Card = ({ children, width = '450px' }) => {
  return (
    <div className="card" style={{ maxWidth: width }}>
      {children}
    </div>
  );
};

export default Card;