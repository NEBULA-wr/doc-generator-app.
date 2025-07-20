import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.title}>{t('welcome')}</h1>
      <p className={styles.subtitle}>{t('tagline')}</p>
      <div className={styles.ctaButtons}>
        <Link to="/register" className={styles.button}>
          {t('get_started')}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;