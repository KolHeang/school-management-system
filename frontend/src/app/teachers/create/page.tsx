'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Upload, User, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/create/create.module.css';
import { Subject } from '@/types';

export default function CreateTeacherPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name_en: '',
    full_name_kh: '',
    email: '',
    phone: '',
    subjectIds: [] as number[],
    bio: '',
    photo: '',
  });
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/subjects');
      setAvailableSubjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const addSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && !formData.subjectIds.includes(val)) {
      setFormData({ ...formData, subjectIds: [...formData.subjectIds, val] });
    }
    e.target.value = ''; // Reset select
  };

  const removeSubject = (subjectId: number) => {
    setFormData({ ...formData, subjectIds: formData.subjectIds.filter(id => id !== subjectId) });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setPhotoPreview(b64);
        setFormData({ ...formData, photo: b64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3001/teachers', formData);
      router.push('/teachers');
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert('Failed to create teacher.');
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
        <h1 className={styles.title}>{t('addTeacher')}</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContainer}>
            {/* Photo */}
            <div className={styles.photoSection}>
              <div className={styles.photoPreview}>
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" />
                  : <div className={styles.photoPlaceholder}><User size={60} /></div>}
              </div>
              <label className={styles.uploadBtn}>
                <Upload size={18} />
                <span>{t('uploadPhoto')}</span>
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>

            {/* Fields */}
            <div className={styles.formDetails}>
              <div className={styles.section}>
                <h3>{t('personalInfo')}</h3>
                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label>{t('fullNameEn')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('fullNameEn')}
                      value={formData.full_name_en}
                      onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t('fullNameKh')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('fullNameKh')}
                      value={formData.full_name_kh}
                      onChange={(e) => setFormData({ ...formData, full_name_kh: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label>{t('email')}</label>
                    <input
                      type="email"
                      required
                      placeholder="teacher@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t('phone')}</label>
                    <input
                      type="text"
                      required
                      placeholder="012 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subjects multi-select */}
                <div className={styles.inputGroup}>
                  <label>{t('subjects')}</label>
                  <select onChange={addSubject} defaultValue="">
                    <option value="" disabled>{t('addSubject')}</option>
                    {availableSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name_en} ({sub.name_kh})</option>
                    ))}
                  </select>
                  {formData.subjectIds.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {formData.subjectIds.map(id => {
                        const sub = availableSubjects.find(s => s.id === id);
                        return sub ? (
                          <span key={id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: '#eef2ff', color: '#4f46e5',
                            padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700
                          }}>
                            {sub.name_en}
                            <button type="button" onClick={() => removeSubject(id)} style={{ color: '#6366f1', lineHeight: 1 }}>
                              <X size={12} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label>{t('bio')}</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe teacher's background..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', outline: 'none', resize: 'vertical' }}
                  />
                </div>
              </div>
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
