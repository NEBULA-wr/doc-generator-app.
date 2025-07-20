import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
    { code: 'en', label: '🇬🇧', title: 'English' },
    { code: 'es', label: '🇪🇸', title: 'Español' },
    { code: 'fr', label: '🇫🇷', title: 'Français' },
    { code: 'pt', label: '🇧🇷', title: 'Português' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.switcher}>
      {LANGUAGES.map(lang => (
        <button 
          key={lang.code}
          onClick={() => changeLanguage(lang.code)} 
          className={i18n.language.startsWith(lang.code) ? styles.active : ''}
          title={lang.title}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;