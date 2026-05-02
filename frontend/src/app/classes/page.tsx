'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from '../students/page.module.css';
import { Classroom } from '@/types';

export default function ClassesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'name', label: t('className') },
    { key: 'grade', label: t('grade') },
    {
      key: 'teacher',
      label: t('teachers'),
      render: (teacher: any) => teacher ? (teacher.full_name_en || teacher.full_name_kh) : t('noTeacher')
    },
    {
      key: 'students',
      label: t('studentCount'),
      render: (students: any[]) => students ? students.length : 0
    },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/classrooms');
      if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`http://localhost:3001/classrooms/${id}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class.');
      }
    }
  };

  const handleEdit = (classroom: Classroom) => {
    router.push(`/classes/${classroom.id}/edit`);
  };

  const handleAdd = () => {
    router.push('/classes/create');
  };

  const filtered = Array.isArray(classes) ? classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('classes')}</h1>
          <p className={styles.subtitle}>{t('classSubtitle')}</p>
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
