'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/create/create.module.css';

export default function CreateSubjectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    code: '',
    name_en: '',
    name_kh: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3001/subjects', formData);
      router.push('/subjects');
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('Failed to create subject.');
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
        <h1 className={styles.title}>{t('add')} {t('subjects')}</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>{t('subjects')}</h3>
            <div className={styles.inputGroup}>
              <label>{t('subjectCode')}</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. MATH101"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>{t('fullNameEn')}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Mathematics"
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('fullNameKh')}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. គណិតវិទ្យា"
                  value={formData.name_kh}
                  onChange={(e) => setFormData({...formData, name_kh: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('description')}</label>
              <textarea 
                rows={3}
                placeholder="..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              {t('cancel')}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              <Save size={20} />
              <span>{isLoading ? t('loading') : t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
