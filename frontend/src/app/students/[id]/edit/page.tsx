'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../../create/create.module.css';
import { Classroom, Province, District, Commune, Village } from '@/types';

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [formData, setFormData] = useState({
    student_code: '',
    full_name_en: '',
    full_name_kh: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    classroomId: '',
    province: '',
    district: '',
    commune: '',
    village: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClasses();
      // Load provinces first, then student (sequential to avoid race conditions)
      fetchProvinces().then(() => fetchStudent());
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/classrooms');
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('http://localhost:3001/address/provinces');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/address/districts/${provinceId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchCommunes = async (districtId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/address/communes/${districtId}`);
      setCommunes(response.data);
    } catch (error) {
      console.error('Error fetching communes:', error);
    }
  };

  const fetchVillages = async (communeId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/address/villages/${communeId}`);
      setVillages(response.data);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/students/${id}`);
      const student = response.data;

      // Pre-load child address levels sequentially before setting formData
      let districtList: District[] = [];
      let communeList: Commune[] = [];
      let villageList: Village[] = [];

      if (student.province?.id) {
        const dRes = await axios.get(`http://localhost:3001/address/districts/${student.province.id}`);
        districtList = dRes.data;
        setDistricts(districtList);
      }
      if (student.district?.id) {
        const cRes = await axios.get(`http://localhost:3001/address/communes/${student.district.id}`);
        communeList = cRes.data;
        setCommunes(communeList);
      }
      if (student.commune?.id) {
        const vRes = await axios.get(`http://localhost:3001/address/villages/${student.commune.id}`);
        villageList = vRes.data;
        setVillages(villageList);
      }

      setFormData({
        student_code: student.student_code,
        full_name_en: student.full_name_en,
        full_name_kh: student.full_name_kh,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dob: student.dob,
        classroomId: student.classroom?.id.toString() || '',
        province: student.province?.id.toString() || '',
        district: student.district?.id.toString() || '',
        commune: student.commune?.id.toString() || '',
        village: student.village?.id.toString() || '',
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      alert(t('saveError'));
      router.push('/students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, province: val, district: '', commune: '', village: '' });
    setDistricts([]); setCommunes([]); setVillages([]);
    if (val) fetchDistricts(parseInt(val));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, district: val, commune: '', village: '' });
    setCommunes([]); setVillages([]);
    if (val) fetchCommunes(parseInt(val));
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, commune: val, village: '' });
    setVillages([]);
    if (val) fetchVillages(parseInt(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        classroomId: formData.classroomId ? parseInt(formData.classroomId) : undefined,
        province: formData.province ? parseInt(formData.province) : undefined,
        district: formData.district ? parseInt(formData.district) : undefined,
        commune: formData.commune ? parseInt(formData.commune) : undefined,
        village: formData.village ? parseInt(formData.village) : undefined,
      };
      await axios.patch(`http://localhost:3001/students/${id}`, payload);
      router.push('/students');
    } catch (error) {
      console.error('Error updating student:', error);
      alert(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>{t('back')}</span>
        </button>
        <h1 className={styles.title}>{t('edit')} {t('students')}</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>{t('personalInfo')}</h3>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>{t('studentCode')}</label>
                <input
                  type="text"
                  required
                  value={formData.student_code}
                  onChange={(e) => setFormData({...formData, student_code: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('fullNameEn')}</label>
                <input
                  type="text"
                  required
                  value={formData.full_name_en}
                  onChange={(e) => setFormData({...formData, full_name_en: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('fullNameKh')}</label>
                <input
                  type="text"
                  required
                  value={formData.full_name_kh}
                  onChange={(e) => setFormData({...formData, full_name_kh: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('gender')}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>{t('email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('phone')}</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>{t('dob')}</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('classroom')}</label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => setFormData({...formData, classroomId: e.target.value})}
                >
                  <option value="">{t('selectClass')}</option>
                  {Array.isArray(classes) && classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>{t('addressInfo')}</h3>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>{t('province')}</label>
                <select value={formData.province} onChange={handleProvinceChange}>
                  <option value="">{t('province')}</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name_km} ({p.name_en})</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>{t('district')}</label>
                <select value={formData.district} onChange={handleDistrictChange} disabled={!formData.province}>
                  <option value="">{t('district')}</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name_km} ({d.name_en})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>{t('commune')}</label>
                <select value={formData.commune} onChange={handleCommuneChange} disabled={!formData.district}>
                  <option value="">{t('commune')}</option>
                  {communes.map(c => (
                    <option key={c.id} value={c.id}>{c.name_km} ({c.name_en})</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>{t('village')}</label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({...formData, village: e.target.value})}
                  disabled={!formData.commune}
                >
                  <option value="">{t('village')}</option>
                  {villages.map(v => (
                    <option key={v.id} value={v.id}>{v.name_km} ({v.name_en})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              {t('cancel')}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              <Save size={20} />
              <span>{isSaving ? t('loading') : t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
