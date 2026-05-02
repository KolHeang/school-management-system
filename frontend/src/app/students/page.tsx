'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from './page.module.css';
import { Student } from '@/types';

export default function StudentsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'student_code', label: t('studentCode') },
    { key: 'full_name_en', label: t('fullNameEn') },
    { key: 'full_name_kh', label: t('fullNameKh') },
    { key: 'email', label: t('email') },
    { key: 'phone', label: t('phone') },
    { key: 'gender', label: t('gender') },
    {
      key: 'classroom',
      label: t('classroom'),
      render: (classroom: any) => classroom ? `${classroom.name} (${classroom.grade})` : t('unassigned')
    },
    {
      key: 'address',
      label: t('address'),
      render: (_: any, student: Student) => {
        const parts = [
          student.village?.name_km,
          student.commune?.name_km,
          student.district?.name_km,
          student.province?.name_km
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : '-';
      }
    }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student.');
      }
    }
  };

  const handleEdit = (student: Student) => {
    router.push(`/students/${student.id}/edit`);
  };

  const handleView = (student: Student) => {
    router.push(`/students/${student.id}`);
  };

  const handleAdd = () => {
    router.push('/students/create');
  };

  const filteredStudents = Array.isArray(students) ? students.filter(s =>
    (s.student_code ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.full_name_en ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.full_name_kh ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('studentsManagement')}</h1>
          <p className={styles.subtitle}>{t('studentSubtitle')}</p>
        </div>
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={20} />
          <span>{t('addStudent')}</span>
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
        data={filteredStudents}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />
    </div>
  );
}
