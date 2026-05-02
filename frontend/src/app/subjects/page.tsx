'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from '../students/page.module.css';
import { Subject } from '@/types';

export default function SubjectsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'code', label: t('subjectCode') },
    { key: 'name_en', label: t('fullNameEn') },
    { key: 'name_kh', label: t('fullNameKh') },
    { key: 'description', label: t('description') },
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/subjects');
      if (Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`http://localhost:3001/subjects/${id}`);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Failed to delete subject.');
      }
    }
  };

  const handleEdit = (subject: Subject) => {
    router.push(`/subjects/${subject.id}/edit`);
  };

  const handleAdd = () => {
    router.push('/subjects/create');
  };

  const filtered = Array.isArray(subjects) ? subjects.filter(s =>
    (s.name_en || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name_kh || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('subjects')}</h1>
          <p className={styles.subtitle}>{t('subjectSubtitle')}</p>
        </div>
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={20} />
          <span>{t('add')}</span>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />
    </div>
  );
}
