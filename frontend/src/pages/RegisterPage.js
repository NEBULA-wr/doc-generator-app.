import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './AuthPages.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      setMessage('Registration successful! Please check your email to confirm your account.');
    } catch (error) {
      setError(error.message || t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className={styles.title}>{t('register')}</h2>
      {error && <p className={styles.errorText}>{error}</p>}
      {message && <p className={styles.successText}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <Input 
          id="email"
          label="Email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input 
          id="password"
          label="Password (min. 6 characters)"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={loading} fullWidth={true}>
          {loading ? t('generatingButton') : t('register')}
        </Button>
      </form>
      <p className={styles.redirectText}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </Card>
  );
};

export default RegisterPage;