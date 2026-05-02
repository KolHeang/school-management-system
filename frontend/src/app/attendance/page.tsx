'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './attendance.module.css';
import { Classroom, Student, AttendanceStatus } from '@/types';

export default function AttendancePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      // Fetch students (either all or filtered by class)
      const studentsUrl = selectedClass 
        ? `http://localhost:3001/students?classroomId=${selectedClass}`
        : 'http://localhost:3001/students';
      const studentsRes = await axios.get(studentsUrl);
      const studentsList = studentsRes.data || [];

      // Fetch existing attendance records for the date (optionally filtered by class)
      const attendanceUrl = selectedClass
        ? `http://localhost:3001/attendance/filter?classroomId=${selectedClass}&date=${selectedDate}`
        : `http://localhost:3001/attendance/filter?date=${selectedDate}`;
      const attendRes = await axios.get(attendanceUrl);
      const existingAttendance = attendRes.data || [];

      // Merge them
      const merged = studentsList.map((student: Student) => {
        const record = existingAttendance.find((a: any) => a.student.id === student.id);
        return {
          ...student,
          attendanceId: record?.id || null,
          morning_status: record?.morning_status || 'present',
          afternoon_status: record?.afternoon_status || 'present',
          remarks: record?.remarks || ''
        };
      });

      setStudents(merged);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: number, session: 'morning' | 'afternoon', status: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { 
      ...s, 
      [session === 'morning' ? 'morning_status' : 'afternoon_status']: status 
    } : s));
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    try {
      for (const student of students) {
        if (student.attendanceId) {
          // Update existing
          await axios.patch(`http://localhost:3001/attendance/${student.attendanceId}`, {
            morning_status: student.morning_status,
            afternoon_status: student.afternoon_status,
            remarks: student.remarks
          });
        } else {
          // Create new
          await axios.post('http://localhost:3001/attendance', {
            studentId: student.id,
            date: selectedDate,
            morning_status: student.morning_status,
            afternoon_status: student.afternoon_status,
            remarks: student.remarks
          });
        }
      }
      alert(t('saveSuccess'));
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#6366f1';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('attendance')}</h1>
          <p className={styles.subtitle}>{t('attendanceSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={styles.addBtn} 
            onClick={() => router.push('/attendance/report')}
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            <span>{t('viewReport')}</span>
          </button>
          <button 
            className={styles.saveBtn} 
            onClick={saveAttendance}
            disabled={isSaving || students.length === 0}
          >
            <Save size={20} />
            <span>{isSaving ? t('loading') : t('saveAttendance')}</span>
          </button>
        </div>
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
          <label>{t('date')}</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loader}>{t('loading')}</div>
      ) : (
        <div className={styles.studentList}>
          {!selectedClass && (
            <div style={{ 
              padding: '12px 20px', 
              background: '#f8fafc', 
              borderBottom: '1px solid #e2e8f0', 
              color: '#64748b', 
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              {t('showingAllStudents')}
            </div>
          )}
          {students.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('fullName')}</th>
                  <th>{t('morning')}</th>
                  <th>{t('afternoon')}</th>
                  <th>{t('remarks')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.avatar} style={{ backgroundColor: '#94a3b8' }}>
                          {student.photo ? (
                            <img src={student.photo} alt={student.full_name_en} className={styles.avatarImg} />
                          ) : (
                            student.full_name_en?.[0] ?? '?'
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600 }}>{student.full_name_en ?? '-'}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{student.full_name_kh ?? '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statusGroup}>
                        <button 
                          className={`${styles.statusBtn} ${student.morning_status === 'present' ? styles.activePresent : ''}`}
                          onClick={() => handleStatusChange(student.id, 'morning', 'present')}
                          title={t('present')}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className={`${styles.statusBtn} ${student.morning_status === 'absent' ? styles.activeAbsent : ''}`}
                          onClick={() => handleStatusChange(student.id, 'morning', 'absent')}
                          title={t('absent')}
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className={`${styles.statusBtn} ${student.morning_status === 'late' ? styles.activeLate : ''}`}
                          onClick={() => handleStatusChange(student.id, 'morning', 'late')}
                          title={t('late')}
                        >
                          <Clock size={18} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statusGroup}>
                        <button 
                          className={`${styles.statusBtn} ${student.afternoon_status === 'present' ? styles.activePresent : ''}`}
                          onClick={() => handleStatusChange(student.id, 'afternoon', 'present')}
                          title={t('present')}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          className={`${styles.statusBtn} ${student.afternoon_status === 'absent' ? styles.activeAbsent : ''}`}
                          onClick={() => handleStatusChange(student.id, 'afternoon', 'absent')}
                          title={t('absent')}
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className={`${styles.statusBtn} ${student.afternoon_status === 'late' ? styles.activeLate : ''}`}
                          onClick={() => handleStatusChange(student.id, 'afternoon', 'late')}
                          title={t('late')}
                        >
                          <Clock size={18} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder={t('addNote')}
                        className={styles.remarksInput}
                        value={student.remarks}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudents(prev => prev.map(s => s.id === student.id ? { ...s, remarks: val } : s));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>{t('noStudentsFound')}</div>
          )}
        </div>
      )}
    </div>
  );
}
