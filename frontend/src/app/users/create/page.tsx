'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/create/create.module.css';
import { Role } from '@/types';

export default function CreateUserPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/roles');
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined
      };
      await axios.post('http://localhost:3001/users', payload);
      router.push('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(t('saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>{t('back')}</span>
        </button>
        <h1 className={styles.title}>{t('addUser')}</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>{t('accountInfo')}</h3>
            <div className={styles.inputGroup}>
              <label>{t('username')}</label>
              <input 
                type="text" 
                required 
                placeholder={t('enterUsername')}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('password')}</label>
              <input 
                type="password" 
                required 
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('assignRole')}</label>
              <select 
                value={formData.roleId}
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
              >
                <option value="">{t('selectRole')}</option>
                {Array.isArray(roles) && roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              {t('cancel')}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              <Save size={20} />
              <span>{isLoading ? t('creating') : t('createUser')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
