import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import styles from './DocumentForm.module.css';

const DocumentForm = ({ onGenerate }) => {
  // Corregido: Ya no se importa 'i18n' ya que no se utiliza en este componente.
  const { t } = useTranslation();
  
  // Estado inicial del formulario con valores de ejemplo
  const [formData, setFormData] = useState({
    name: 'Alex Doe',
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    itemDescription: 'Website Development Services & Hosting for 1 Year',
    amount: '250.75',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);

  // Maneja los cambios en cualquier campo del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Llama a la función 'onGenerate' pasada desde el Dashboard,
    // enviándole los datos del formulario.
    await onGenerate(formData);
    setLoading(false);
  };

  return (
    <Card width="100%">
      <form onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{t('formTitle')}</h2>
        
        <div className={styles.formRow}>
          <Input 
            id="name" 
            name="name" 
            label={t('nameLabel')} 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
          <Input 
            id="invoiceNumber" 
            name="invoiceNumber" 
            label={t('invoiceNumberLabel')} 
            value={formData.invoiceNumber} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        {/* Usamos nuestro componente Input versátil para renderizar un textarea */}
        <Input 
          as="textarea"
          id="itemDescription" 
          name="itemDescription" 
          label={t('itemDescriptionLabel')} 
          value={formData.itemDescription} 
          onChange={handleInputChange} 
          required 
          rows="3" 
        />
        
        <div className={styles.formRow}>
          <Input 
            id="amount" 
            name="amount" 
            label={t('amountLabel')} 
            type="number" 
            step="0.01" 
            value={formData.amount} 
            onChange={handleInputChange} 
            required 
          />
          <Input 
            id="date" 
            name="date" 
            label={t('dateLabel')} 
            type="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <Button type="submit" disabled={loading} fullWidth={true}>
          {loading ? t('generatingButton') : t('generateButton')}
        </Button>
      </form>
    </Card>
  );
};

export default DocumentForm;  