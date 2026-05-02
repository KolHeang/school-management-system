'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/create/create.module.css';
import { Teacher } from '@/types';

export default function CreateClassPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacherId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/teachers');
      if (Array.isArray(response.data)) {
        setTeachers(response.data);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined
      };
      await axios.post('http://localhost:3001/classrooms', payload);
      router.push('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
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
        <h1 className={styles.title}>{t('addClassroom')}</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>{t('classroomInfo')}</h3>
            <div className={styles.inputGroup}>
              <label>{t('className')}</label>
              <input 
                type="text" 
                required 
                placeholder={t('classNamePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('gradeLevel')}</label>
              <input 
                type="text" 
                required 
                placeholder={t('gradeLevelPlaceholder')}
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>{t('assignTeacher')}</label>
              <select 
                value={formData.teacherId}
                onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              >
                <option value="">{t('selectTeacher')}</option>
                {Array.isArray(teachers) && teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.full_name_en || t.full_name_kh} {t.subjects && t.subjects.length > 0 ? `(${t.subjects.map(s => s.name_en).join(', ')})` : ''}
                  </option>
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
              <span>{isLoading ? t('creating') : t('createClass')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
