'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './MiniCalendar.module.css';

export default function MiniCalendar() {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className={styles.dayEmpty}></div>);
  }

  // Days of the month
  for (let d = 1; d <= totalDays; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    days.push(
      <div key={d} className={`${styles.day} ${isToday ? styles.today : ''} ${isWeekend ? styles.weekend : ''}`}>
        {d}
      </div>
    );
  }

  const weekDays = [
    t('daySun'), t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat')
  ];

  const monthLabel = t(`month${month + 1}` as any);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>{monthLabel} {year}</h3>
        <div className={styles.nav}>
          <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={16} /></button>
          <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={16} /></button>
        </div>
      </div>
      
      <div className={styles.weekDays}>
        {weekDays.map((d, i) => (
          <div key={i} className={`${styles.weekDay} ${i === 0 || i === 6 ? styles.weekendText : ''}`}>
            {d}
          </div>
        ))}
      </div>
      
      <div className={styles.daysGrid}>
        {days}
      </div>
    </div>
  );
}
