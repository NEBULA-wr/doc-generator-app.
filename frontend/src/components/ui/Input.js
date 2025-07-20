import React from 'react';
import './Input.css';

// Añadimos 'as' como una prop. Por defecto es 'input'.
const Input = ({ label, id, as = 'input', ...props }) => {
  const InputComponent = as; // 'input' o 'textarea'

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <InputComponent id={id} {...props} />
    </div>
  );
};

export default Input;