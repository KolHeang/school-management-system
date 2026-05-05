'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './PromoteModal.module.css';

interface Classroom {
  id: number;
  name: string;
  grade: string;
}

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromote: (classroomId: number) => void;
  studentCount: number;
}

export default function PromoteModal({ isOpen, onClose, onPromote, studentCount }: PromoteModalProps) {
  const { t } = useLanguage();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClassrooms();
    }
  }, [isOpen]);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    setIsSubmitting(true);
    try {
      await onPromote(parseInt(selectedClassId));
      onClose();
    } catch (error) {
      console.error('Promotion error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`glass ${styles.modal} animate-scale-in`}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.iconBox}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3>{t('promoteStudents')}</h3>
              <p>{t('promoting')} {studentCount} {t('students')}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{t('targetClassroom')}</label>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">{t('selectClass')}</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.grade})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className={styles.promoteBtn}
              disabled={!selectedClassId || isSubmitting}
            >
              {isSubmitting ? t('loading') : t('promote')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
