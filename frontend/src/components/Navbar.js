import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navbar.module.css';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const Navbar = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link to={user ? "/dashboard" : "/"} className={styles.brand} onClick={closeMenu}>
        <span role="img" aria-label="document icon">📄</span>
        ProGen
      </Link>
      
      <div className={styles.desktopMenu}>
        <LanguageSwitcher />
        {user ? (
          <>
            <span className={styles.welcomeText}>Hola, {user.email.split('@')[0]}</span>
            <button onClick={handleLogout} className={styles.navButtonLogout}>{t('logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>{t('login')}</Link>
            <Link to="/register" className={styles.navButtonRegister}>{t('register')}</Link>
          </>
        )}
      </div>

      <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {user ? (
            <>
              <span className={styles.welcomeText}>Hola, {user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className={styles.navButtonLogout}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink} onClick={closeMenu}>{t('login')}</Link>
              <Link to="/register" className={styles.navButtonRegister} onClick={closeMenu}>{t('register')}</Link>
            </>
          )}
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
};

export default Navbar;