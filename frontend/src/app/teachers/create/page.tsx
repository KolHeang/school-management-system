'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Upload, User, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/create/create.module.css';

export default function CreateTeacherPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name_en: '',
    full_name_kh: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    bio: '',
    photo: '',
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !formData.subjects.includes(trimmed)) {
      setFormData({ ...formData, subjects: [...formData.subjects, trimmed] });
    }
    setSubjectInput('');
  };

  const removeSubject = (subject: string) => {
    setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
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

                {/* Subjects multi-input */}
                <div className={styles.inputGroup}>
                  <label>{t('subjects')}</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder={t('addSubject')}
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={addSubject}
                      style={{
                        padding: '10px 16px', background: 'var(--primary)', color: 'white',
                        borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {formData.subjects.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {formData.subjects.map((s, i) => (
                        <span key={i} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#eef2ff', color: '#4f46e5',
                          padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700
                        }}>
                          {s}
                          <button type="button" onClick={() => removeSubject(s)} style={{ color: '#6366f1', lineHeight: 1 }}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
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
