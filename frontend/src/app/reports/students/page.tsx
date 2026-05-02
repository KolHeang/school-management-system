'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Users, PieChart, BarChart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../reports.module.css';

export default function StudentReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reports/students');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching student stats:', error);
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
            <h1 className={styles.title}>{t('studentReport')}</h1>
            <p className={styles.subtitle}>{t('reportsSubtitle')}</p>
          </div>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#6366f1' }}>{stats.total}</div>
          <div className={styles.statLabel}>{t('totalStudents')}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#3b82f6' }}>{stats.male}</div>
          <div className={styles.statLabel}>{t('male')}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#ec4899' }}>{stats.female}</div>
          <div className={styles.statLabel}>{t('female')}</div>
        </div>
      </div>

      <div className={styles.reportLayout}>
        <div className={styles.reportSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <BarChart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Students by Class
            </h3>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('classroom')}</th>
                <th>{t('grade')}</th>
                <th style={{ textAlign: 'right' }}>{t('totalCount')}</th>
              </tr>
            </thead>
            <tbody>
              {stats.byClass.map((c: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.className}</td>
                  <td>{c.grade}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.reportSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <PieChart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Gender Distribution
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                <span>{t('male')}</span>
                <span>{((stats.male / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.male / stats.total) * 100}%`, height: '100%', background: '#3b82f6' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                <span>{t('female')}</span>
                <span>{((stats.female / stats.total) * 100).toFixed(1)}%</span>
              </div>
              <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${(stats.female / stats.total) * 100}%`, height: '100%', background: '#ec4899' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
