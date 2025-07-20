import React from 'react';
// --- LA CORRECCIÓN ESTÁ EN LA SIGUIENTE LÍNEA ---
import Button from '../Button'; // Cambiamos './Button' por '../Button' para subir un nivel
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}> {/* Evita que el modal se cierre al hacer clic dentro */}
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;