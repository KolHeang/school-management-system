'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserSquare2, GraduationCap, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import MiniCalendar from '@/components/MiniCalendar';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('welcomeBack')}, {t('admin')}</h1>
          <p className={styles.subtitle}>{t('dashboardSubtitle')}</p>
        </div>
        <div className={styles.date}>
          {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'km-KH', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title={t('totalStudents')}
          value={stats.totalStudents}
          icon={Users}
          color="#6366f1"
        />
        <StatCard
          title={t('totalTeachers')}
          value={stats.totalTeachers}
          icon={UserSquare2}
          color="#10b981"
        />
        <StatCard
          title={t('totalClassrooms')}
          value={stats.totalClassrooms}
          icon={GraduationCap}
          color="#f59e0b"
        />
        <StatCard
          title={t('attendanceRate')}
          value="98.5%"
          icon={TrendingUp}
          color="#ec4899"
        />
      </section>

      <section className={styles.mainContent}>
        <div className={`glass ${styles.recentActivity}`}>
          <h2 className={styles.sectionTitle}>{t('recentActivity')}</h2>
          <div className={styles.placeholder}>
            <p>{t('noRecentActivity')}</p>
          </div>
        </div>

        <div className={`glass ${styles.upcomingEvents}`}>
          <h2 className={styles.sectionTitle}>{t('upcomingEvents')}</h2>
          <div className={styles.calendarWrapper}>
            <MiniCalendar />
          </div>
        </div>
      </section>
    </div>
  );
}
