import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './AuthPages.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className={styles.title}>{t('login')}</h2>
      {error && <p className={styles.errorText}>{error}</p>}
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
          label="Password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={loading} fullWidth={true}>
          {loading ? t('generatingButton') : t('login')}
        </Button>
      </form>
      <p className={styles.redirectText}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </Card>
  );
};

export default LoginPage;