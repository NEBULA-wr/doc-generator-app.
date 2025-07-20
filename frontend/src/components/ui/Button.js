import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', disabled = false, fullWidth = false }) => {
  const className = `custom-button ${fullWidth ? 'full-width' : ''}`;
  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;