'use client';

import { useRouter } from 'next/navigation';
import { CalendarCheck, Users, UserSquare2, BarChart3, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './reports.module.css';

export default function ReportsDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  const reportCards = [
    {
      id: 'attendance',
      title: t('attendanceReport'),
      description: 'Daily and periodic attendance statistics for all classrooms.',
      icon: CalendarCheck,
      path: '/attendance/report',
      color: '#6366f1'
    },
    {
      id: 'students',
      title: t('studentReport'),
      description: 'Detailed student enrollment data, gender distribution, and class-wise statistics.',
      icon: Users,
      path: '/reports/students',
      color: '#10b981'
    },
    {
      id: 'teachers',
      title: t('teacherReport'),
      description: 'Teacher assignments, subject coverage, and workload analytics.',
      icon: UserSquare2,
      path: '/reports/teachers',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('reportsDashboard')}</h1>
          <p className={styles.subtitle}>{t('reportsSubtitle')}</p>
        </div>
      </header>

      <div className={styles.grid}>
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id} 
              className={styles.card} 
              onClick={() => router.push(card.path)}
            >
              <div className={styles.iconWrapper} style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
                <div className={styles.cardFooter}>
                  <span style={{ color: card.color }}>{t('viewReport')}</span>
                  <ArrowRight size={16} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
