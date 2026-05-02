'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input type="text" placeholder={t('search')} />
      </div>

      <div className={styles.actions}>
        <div className={styles.langSwitch}>
          <button 
            onClick={() => setLanguage('en')} 
            className={language === 'en' ? styles.activeLang : ''}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('km')} 
            className={language === 'km' ? styles.activeLang : ''}
          >
            ខ្មែរ
          </button>
        </div>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
        
        <div className={styles.profileWrapper}>
          <div className={styles.profile} onClick={() => setShowDropdown(!showDropdown)}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.username || 'Admin'}</span>
              <span className={styles.userRole}>{user?.role?.name || 'Administrator'}</span>
            </div>
            <ChevronDown size={16} className={`${styles.chevron} ${showDropdown ? styles.chevronUp : ''}`} />
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <LogOut size={18} />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
