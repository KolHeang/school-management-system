'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Pencil, BookOpen, Mail, Phone, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../students/[id]/detail.module.css';

export default function TeacherDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useLanguage();
  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (id) fetchTeacher(); }, [id]);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/teachers/${id}`);
      setTeacher(res.data);
    } catch {
      console.error('Error fetching teacher');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loader}><User size={20} />{t('loading')}</div>;
  if (!teacher) return <div className={styles.loader}>Teacher not found.</div>;

  const initial = (teacher.full_name_en ?? '?')[0]?.toUpperCase();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={20} />
            <span>{t('back')}</span>
          </button>
          <h1 className={styles.title}>{t('teachers')}</h1>
        </div>
        <button className={styles.editBtn} onClick={() => router.push(`/teachers/${id}/edit`)}>
          <Pencil size={16} />
          <span>{t('edit')}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileBanner} style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)' }} />
        <div className={styles.profileBody}>
          <div className={styles.avatarWrap}>
            {teacher.photo ? (
              <img src={teacher.photo} alt="Profile" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder} style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' }}>
                {initial}
              </div>
            )}
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.profileName}>{teacher.full_name_en ?? '-'}</div>
            <div className={styles.profileNameKh}>{teacher.full_name_kh ?? ''}</div>
            <div className={styles.badgeRow}>
              {(teacher.subjects ?? []).map((s: any, i: number) => (
                <span key={i} className={`${styles.badge} ${styles.badgeClass}`}>
                  <BookOpen size={11} />
                  {s.name_en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className={styles.grid}>
        {/* Contact */}
        <div className={styles.infoCard}>
          <div className={styles.sectionTitle}>{t('personalInfo')}</div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('fullNameEn')}</span>
            <span className={styles.fieldValue}>{teacher.full_name_en ?? '—'}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('fullNameKh')}</span>
            <span className={styles.fieldValue}>{teacher.full_name_kh ?? '—'}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('email')}</span>
            {teacher.email
              ? <span className={styles.fieldValue}>{teacher.email}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('phone')}</span>
            {teacher.phone
              ? <span className={styles.fieldValue}>{teacher.phone}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>
        </div>

        {/* Subjects & Bio */}
        <div className={styles.infoCard}>
          <div className={styles.sectionTitle}>{t('subjects')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {(teacher.subjects ?? []).length > 0
              ? teacher.subjects.map((s: any, i: number) => (
                <span key={i} style={{
                  background: '#f0f9ff', color: '#0ea5e9',
                  padding: '4px 14px', borderRadius: 20,
                  fontSize: 13, fontWeight: 700
                }}>{s.name_en}</span>
              ))
              : <span className={styles.fieldEmpty}>—</span>}
          </div>

          <div className={styles.sectionTitle}>{t('bio')}</div>
          <div className={styles.field}>
            {teacher.bio
              ? <span className={styles.fieldValue} style={{ lineHeight: 1.7, fontWeight: 400, fontSize: 14 }}>{teacher.bio}</span>
              : <span className={styles.fieldEmpty}>—</span>}
          </div>
        </div>

        {/* Assigned Classrooms */}
        {teacher.classrooms && teacher.classrooms.length > 0 && (
          <div className={styles.infoCard} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.sectionTitle}>{t('classes')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {teacher.classrooms.map((c: any) => (
                <span key={c.id} style={{
                  background: '#fff7ed', color: '#c2410c',
                  padding: '6px 16px', borderRadius: 20,
                  fontSize: 13, fontWeight: 700
                }}>
                  {c.name} — {c.grade}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
