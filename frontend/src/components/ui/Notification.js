import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button onClick={onDismiss} className="dismiss-btn">×</button>
    </div>
  );
};

export default Notification;