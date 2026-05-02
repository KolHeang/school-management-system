'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Upload, User } from 'lucide-react';
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
    photo: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchClasses();
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

      if (student.province?.id) fetchDistricts(student.province.id);
      if (student.district?.id) fetchCommunes(student.district.id);
      if (student.commune?.id) fetchVillages(student.commune.id);

      setFormData({
        student_code: student.student_code || '',
        full_name_en: student.full_name_en || '',
        full_name_kh: student.full_name_kh || '',
        email: student.email || '',
        phone: student.phone || '',
        gender: student.gender || 'Male',
        dob: student.dob || '',
        classroomId: student.classroom?.id.toString() || '',
        province: student.province?.id.toString() || '',
        district: student.district?.id.toString() || '',
        commune: student.commune?.id.toString() || '',
        village: student.village?.id.toString() || '',
        photo: student.photo || ''
      });
      if (student.photo) setPhotoPreview(student.photo);
    } catch (error) {
      console.error('Error fetching student:', error);
      router.push('/students');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
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
          <div className={styles.formContainer}>
            <div className={styles.photoSection}>
              <div className={styles.photoPreview}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <div className={styles.photoPlaceholder}><User size={60} /></div>
                )}
              </div>
              <label className={styles.uploadBtn}>
                <Upload size={18} />
                <span>{t('uploadPhoto')}</span>
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>

            <div className={styles.formDetails}>
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
                      {provinces.map(p => <option key={p.id} value={p.id}>{p.name_km} ({p.name_en})</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t('district')}</label>
                    <select value={formData.district} onChange={handleDistrictChange} disabled={!formData.province}>
                      <option value="">{t('district')}</option>
                      {districts.map(d => <option key={d.id} value={d.id}>{d.name_km} ({d.name_en})</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label>{t('commune')}</label>
                    <select value={formData.commune} onChange={handleCommuneChange} disabled={!formData.district}>
                      <option value="">{t('commune')}</option>
                      {communes.map(c => <option key={c.id} value={c.id}>{c.name_km} ({c.name_en})</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t('village')}</label>
                    <select value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} disabled={!formData.commune}>
                      <option value="">{t('village')}</option>
                      {villages.map(v => <option key={v.id} value={v.id}>{v.name_km} ({v.name_en})</option>)}
                    </select>
                  </div>
                </div>
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
