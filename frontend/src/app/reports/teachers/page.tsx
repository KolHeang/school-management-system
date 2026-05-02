'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, UserSquare2, BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../reports.module.css';

export default function TeacherReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reports/teachers');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center' }}>No data available.</div>;

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{t('teacherReport')}</h1>
            <p className={styles.subtitle}>{t('reportsSubtitle')}</p>
          </div>
        </div>
      </header>

      <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{stats.total}</div>
          <div className={styles.statLabel}>{t('totalTeachers')}</div>
        </div>
      </div>

      <div className={styles.reportSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <UserSquare2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Teacher Workload & Assignments
          </h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('fullName')}</th>
              <th style={{ textAlign: 'center' }}>{t('classes')}</th>
              <th style={{ textAlign: 'center' }}>{t('subjects')}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.workload.map((item: any, i: number) => {
              const workloadStatus = item.classesCount > 2 ? 'High' : item.classesCount === 0 ? 'Low' : 'Optimal';
              const statusColor = workloadStatus === 'High' ? '#ef4444' : workloadStatus === 'Low' ? '#f59e0b' : '#10b981';
              
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <GraduationCap size={14} color="#64748b" />
                      {item.classesCount}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="#64748b" />
                      {item.subjectsCount}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      backgroundColor: `${statusColor}15`, 
                      color: statusColor 
                    }}>
                      {workloadStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
