'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Pencil, User, Mail, Phone, CalendarDays, BookOpen, MapPin, Hash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './detail.module.css';

export default function StudentDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useLanguage();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/students/${id}`);
      setStudent(res.data);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <User size={20} />
        {t('loading')}
      </div>
    );
  }

  if (!student) {
    return (
      <div className={styles.loader}>
        Student not found.
      </div>
    );
  }

  const fullAddress = [
    student.village?.name_en,
    student.commune?.name_en,
    student.district?.name_en,
    student.province?.name_en,
  ].filter(Boolean).join(', ') || null;

  const fullAddressKh = [
    student.village?.name_km,
    student.commune?.name_km,
    student.district?.name_km,
    student.province?.name_km,
  ].filter(Boolean).join(', ') || null;

  const initial = (student.full_name_en ?? student.student_code ?? '?')[0]?.toUpperCase();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={20} />
            <span>{t('back')}</span>
          </button>
          <h1 className={styles.title}>{t('students')}</h1>
        </div>
        <button
          className={styles.editBtn}
          onClick={() => router.push(`/students/${id}/edit`)}
        >
          <Pencil size={16} />
          <span>{t('edit')}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileBanner} />
        <div className={styles.profileBody}>
          <div className={styles.avatarWrap}>
            {student.photo ? (
              <img src={student.photo} alt="Profile" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.profileName}>{student.full_name_en ?? '-'}</div>
            <div className={styles.profileNameKh}>{student.full_name_kh ?? ''}</div>
            <div className={styles.badgeRow}>
              {student.student_code && (
                <span className={`${styles.badge} ${styles.badgeCode}`}>
                  <Hash size={11} />
                  {student.student_code}
                </span>
              )}
              {student.gender && (
                <span className={`${styles.badge} ${styles.badgeGender}`}>
                  {student.gender}
                </span>
              )}
              {student.classroom && (
                <span className={`${styles.badge} ${styles.badgeClass}`}>
                  <BookOpen size={11} />
                  {student.classroom.name} — {student.classroom.grade}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className={styles.grid}>
        {/* Personal Info */}
        <div className={styles.infoCard}>
          <div className={styles.sectionTitle}>{t('personalInfo')}</div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('studentCode')}</span>
            {student.student_code
              ? <span className={styles.fieldValue}>{student.student_code}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('fullNameEn')}</span>
            {student.full_name_en
              ? <span className={styles.fieldValue}>{student.full_name_en}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('fullNameKh')}</span>
            {student.full_name_kh
              ? <span className={styles.fieldValue}>{student.full_name_kh}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('gender')}</span>
            <span className={styles.fieldValue}>{student.gender ?? '—'}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('dob')}</span>
            {student.dob
              ? <span className={styles.fieldValue}>{new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>
        </div>

        {/* Contact Info */}
        <div className={styles.infoCard}>
          <div className={styles.sectionTitle}>{t('email')} &amp; {t('phone')}</div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('email')}</span>
            {student.email
              ? <span className={styles.fieldValue}>{student.email}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('phone')}</span>
            {student.phone
              ? <span className={styles.fieldValue}>{student.phone}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.sectionTitle} style={{ marginTop: 24 }}>{t('classroom')}</div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('className')}</span>
            {student.classroom
              ? <span className={styles.fieldValue}>{student.classroom.name} ({student.classroom.grade})</span>
              : <span className={styles.fieldEmpty}>{t('unassigned')}</span>}
          </div>
        </div>

        {/* Address */}
        <div className={styles.infoCard} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.sectionTitle}>{t('addressInfo')}</div>
          <div className={styles.grid} style={{ marginBottom: 0 }}>
            <div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('province')}</span>
                {student.province
                  ? <span className={styles.fieldValue}>{student.province.name_en} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {student.province.name_km}</span></span>
                  : <span className={styles.fieldEmpty}>—</span>}
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('district')}</span>
                {student.district
                  ? <span className={styles.fieldValue}>{student.district.name_en} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {student.district.name_km}</span></span>
                  : <span className={styles.fieldEmpty}>—</span>}
              </div>
            </div>
            <div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('commune')}</span>
                {student.commune
                  ? <span className={styles.fieldValue}>{student.commune.name_en} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {student.commune.name_km}</span></span>
                  : <span className={styles.fieldEmpty}>—</span>}
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('village')}</span>
                {student.village
                  ? <span className={styles.fieldValue}>{student.village.name_en} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {student.village.name_km}</span></span>
                  : <span className={styles.fieldEmpty}>—</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
