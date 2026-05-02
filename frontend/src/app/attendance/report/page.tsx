'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, FileDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './report.module.css';
import { Classroom } from '@/types';

export default function AttendanceReportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/classrooms');
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchReport = async () => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/attendance/report?classroomId=${selectedClass}&startDate=${startDate}&endDate=${endDate}`
      );
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && startDate && endDate) {
      fetchReport();
    }
  }, [selectedClass, startDate, endDate]);

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>{t('attendanceReport')}</h1>
            <p className={styles.subtitle}>{t('attendanceSubtitle')}</p>
          </div>
        </div>
        <button className={styles.exportBtn} onClick={() => window.print()}>
          <FileDown size={20} />
          <span>Export PDF</span>
        </button>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.inputGroup}>
          <label>{t('classroom')}</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className={styles.select}
          >
            <option value="">{t('selectClass')}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>{t('startDate')}</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>{t('endDate')}</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loader}>{t('loading')}</div>
      ) : selectedClass ? (
        <div className={styles.reportContainer}>
          {reportData.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('student')}</th>
                  <th style={{ textAlign: 'center' }}>{t('presentCount')}</th>
                  <th style={{ textAlign: 'center' }}>{t('absentCount')}</th>
                  <th style={{ textAlign: 'center' }}>{t('lateCount')}</th>
                  <th style={{ textAlign: 'center' }}>{t('excusedCount')}</th>
                  <th style={{ textAlign: 'center' }}>{t('attendance')} %</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(item => {
                  const attendanceRate = ((item.present / item.total) * 100).toFixed(1);
                  return (
                    <tr key={item.student.id}>
                      <td>
                        <div className={styles.studentInfo}>
                          <div className={styles.avatar}>
                            {item.student.full_name_en?.[0] ?? '?'}
                          </div>
                          <div>
                            <div className={styles.nameEn}>{item.student.full_name_en ?? '-'}</div>
                            <div className={styles.nameKh}>{item.student.full_name_kh ?? '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{item.present}</td>
                      <td style={{ textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{item.absent}</td>
                      <td style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 600 }}>{item.late}</td>
                      <td style={{ textAlign: 'center', color: '#6366f1', fontWeight: 600 }}>{item.excused}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div className={styles.rateWrapper}>
                          <div className={styles.rateBar}>
                            <div className={styles.rateFill} style={{ width: `${attendanceRate}%`, backgroundColor: parseFloat(attendanceRate) > 80 ? '#10b981' : '#f59e0b' }} />
                          </div>
                          <span className={styles.rateText}>{attendanceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>{t('noRecordsFound')}</div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>{t('selectClassToView')}</div>
      )}
    </div>
  );
}
