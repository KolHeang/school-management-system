'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from '../students/page.module.css';
import { Teacher, Subject } from '@/types';

export default function TeachersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      key: 'photo',
      label: t('photo'),
      render: (_: any, teacher: Teacher) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {teacher.photo ? (
            <img
              src={teacher.photo}
              alt="photo"
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', border: '2px solid #e2e8f0' }}
            />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 14
            }}>
              {(teacher.full_name_en ?? '?')[0]?.toUpperCase()}
            </div>
          )}
        </div>
      )
    },
    { key: 'full_name_en', label: t('fullNameEn') },
    { key: 'full_name_kh', label: t('fullNameKh') },
    { key: 'email', label: t('email') },
    { key: 'phone', label: t('phone') },
    {
      key: 'subjects',
      label: t('subjects'),
      render: (subjects: Subject[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(subjects ?? []).map((s, i) => (
            <span key={i} style={{
              background: '#eef2ff', color: '#4f46e5',
              padding: '2px 10px', borderRadius: 20,
              fontSize: 12, fontWeight: 700
            }}>{s.name_en}</span>
          ))}
        </div>
      )
    },
  ];

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/teachers');
      setTeachers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`http://localhost:3001/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Failed to delete teacher.');
      }
    }
  };

  const handleEdit = (teacher: Teacher) => router.push(`/teachers/${teacher.id}/edit`);
  const handleView = (teacher: Teacher) => router.push(`/teachers/${teacher.id}`);
  const handleAdd = () => router.push('/teachers/create');

  const filtered = Array.isArray(teachers) ? teachers.filter(tc =>
    (tc.full_name_en ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tc.full_name_kh ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tc.subjects ?? []).some((s: any) => s.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('teachers')}</h1>
          <p className={styles.subtitle}>{t('teacherSubtitle')}</p>
        </div>
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={20} />
          <span>{t('addTeacher')}</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('search')}
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />
    </div>
  );
}
