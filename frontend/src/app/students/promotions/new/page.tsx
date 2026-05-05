'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronRight, GraduationCap, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from './page.module.css';
import { Student } from '@/types';

interface Classroom {
  id: number;
  name: string;
  grade: string;
}

export default function NewPromotionPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sourceClassId, setSourceClassId] = useState<string>('');
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (sourceClassId) {
      fetchStudents(parseInt(sourceClassId));
    } else {
      setStudents([]);
      setSelectedIds([]);
    }
  }, [sourceClassId]);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const fetchStudents = async (classroomId: number) => {
    setIsLoadingStudents(true);
    try {
      const response = await axios.get(`http://localhost:3001/students?classroomId=${classroomId}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handlePromote = async () => {
    if (!targetClassId || selectedIds.length === 0) return;

    setIsSubmitting(true);
    try {
      await axios.patch('http://localhost:3001/promotions', {
        studentIds: selectedIds,
        classroomId: parseInt(targetClassId)
      });
      alert(t('promotionSuccess'));
      router.push('/students/promotions');
    } catch (error) {
      console.error('Error promoting students:', error);
      alert('Failed to promote students.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'student_code', label: t('studentCode') },
    { key: 'full_name_en', label: t('fullNameEn') },
    { key: 'full_name_kh', label: t('fullNameKh') },
    { key: 'gender', label: t('gender') },
  ];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={20} />
          <span>{t('back')}</span>
        </button>
        <h1 className={styles.title}>{t('newPromotion')}</h1>
      </header>

      <div className={styles.wizardContainer}>
        {/* Step 1: Source Selection */}
        <div className={`glass ${styles.stepCard}`}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>1</div>
            <h3>{t('sourceClassroom')}</h3>
          </div>
          <select 
            value={sourceClassId} 
            onChange={(e) => setSourceClassId(e.target.value)}
            className={styles.select}
          >
            <option value="">{t('selectClass')}</option>
            {classrooms.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name} ({cls.grade})</option>
            ))}
          </select>
        </div>

        {/* Step 2: Student Selection */}
        <div className={`glass ${styles.stepCard} ${!sourceClassId ? styles.disabled : ''}`}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>2</div>
            <h3>{t('selectStudents')}</h3>
          </div>
          <DataTable
            columns={columns}
            data={students}
            isLoading={isLoadingStudents}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            t={t}
          />
        </div>

        {/* Step 3: Target Selection & Action */}
        <div className={`glass ${styles.stepCard} ${selectedIds.length === 0 ? styles.disabled : ''}`}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>3</div>
            <h3>{t('targetClassroom')}</h3>
          </div>
          <div className={styles.targetSection}>
            <select 
              value={targetClassId} 
              onChange={(e) => setTargetClassId(e.target.value)}
              className={styles.select}
              disabled={selectedIds.length === 0}
            >
              <option value="">{t('selectClass')}</option>
              {classrooms.filter(c => c.id !== parseInt(sourceClassId)).map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} ({cls.grade})</option>
              ))}
            </select>
            
            <button 
              className={styles.promoteBtn}
              disabled={!targetClassId || selectedIds.length === 0 || isSubmitting}
              onClick={handlePromote}
            >
              {isSubmitting ? t('loading') : (
                <>
                  <GraduationCap size={20} />
                  <span>{t('promote')} ({selectedIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
