'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../../students/create/create.module.css';

export default function EditSubjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    code: '',
    name_en: '',
    name_kh: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSubject();
    }
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/subjects/${id}`);
      const subject = response.data;
      setFormData({
        code: subject.code,
        name_en: subject.name_en,
        name_kh: subject.name_kh,
        description: subject.description || ''
      });
    } catch (error) {
      console.error('Error fetching subject:', error);
      router.push('/subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.patch(`http://localhost:3001/subjects/${id}`, formData);
      router.push('/subjects');
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Failed to update subject.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>{t('back')}</span>
        </button>
        <h1 className={styles.title}>{t('edit')} {t('subjects')}</h1>
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
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('fullNameKh')}</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name_kh}
                  onChange={(e) => setFormData({...formData, name_kh: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t('description')}</label>
              <textarea 
                rows={3}
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
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              <Save size={20} />
              <span>{isSaving ? t('loading') : t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
