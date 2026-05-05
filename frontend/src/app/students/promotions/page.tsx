'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from './page.module.css';

interface PromotionRecord {
  id: number;
  student: {
    full_name_en: string;
    full_name_kh: string;
    student_code: string;
  };
  fromClassroom: {
    name: string;
    grade: string;
  } | null;
  toClassroom: {
    name: string;
    grade: string;
  };
  promotionDate: string;
  academicYear: string;
}

export default function PromotionHistoryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [history, setHistory] = useState<PromotionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      key: 'student',
      label: t('student'),
      render: (student: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{student.full_name_en}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.student_code}</div>
        </div>
      )
    },
    {
      key: 'fromClassroom',
      label: t('fromClass'),
      render: (cls: any) => cls ? `${cls.name} (${cls.grade})` : t('unassigned')
    },
    {
      key: 'toClassroom',
      label: t('toClass'),
      render: (cls: any) => cls ? `${cls.name} (${cls.grade})` : '-'
    },
    {
      key: 'academicYear',
      label: t('academicYear')
    },
    {
      key: 'promotionDate',
      label: t('promotionDate'),
      render: (date: string) => new Date(date).toLocaleString()
    }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3001/promotions/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching promotion history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(record => 
    (record.student.full_name_en ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.student.full_name_kh ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.student.student_code ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('promotions')}</h1>
          <p className={styles.subtitle}>{t('viewAllPromotionRecords')}</p>
        </div>
        <button 
          className={styles.addBtn} 
          onClick={() => router.push('/students/promotions/new')}
        >
          <Plus size={20} />
          <span>{t('newPromotion')}</span>
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
        data={filteredHistory}
        isLoading={isLoading}
        t={t}
      />
    </div>
  );
}
