'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { Classroom, Student, Province, District, Commune, Village } from '@/types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student?: Student | null;
}

export default function StudentModal({ isOpen, onClose, onSuccess, student }: StudentModalProps) {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    classroomId: '',
    province: '',
    district: '',
    commune: '',
    village: ''
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      fetchProvinces();
      if (student) {
        setFormData({
          name: student.name,
          email: student.email,
          phone: student.phone,
          gender: student.gender,
          dob: student.dob,
          classroomId: student.classroom?.id.toString() || '',
          province: student.province?.id.toString() || '',
          district: student.district?.id.toString() || '',
          commune: student.commune?.id.toString() || '',
          village: student.village?.id.toString() || ''
        });

        if (student.province) fetchDistricts(student.province.id);
        if (student.district) fetchCommunes(student.district.id);
        if (student.commune) fetchVillages(student.commune.id);
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          gender: 'Male',
          dob: '',
          classroomId: '',
          province: '',
          district: '',
          commune: '',
          village: ''
        });
        setDistricts([]);
        setCommunes([]);
        setVillages([]);
      }
    }
  }, [isOpen, student]);

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

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setFormData({ ...formData, province: provinceId, district: '', commune: '', village: '' });
    setDistricts([]);
    setCommunes([]);
    setVillages([]);
    if (provinceId) fetchDistricts(parseInt(provinceId));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district: districtId, commune: '', village: '' });
    setCommunes([]);
    setVillages([]);
    if (districtId) fetchCommunes(parseInt(districtId));
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communeId = e.target.value;
    setFormData({ ...formData, commune: communeId, village: '' });
    setVillages([]);
    if (communeId) fetchVillages(parseInt(communeId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        classroomId: formData.classroomId ? parseInt(formData.classroomId) : undefined,
        province: formData.province ? parseInt(formData.province) : undefined,
        district: formData.district ? parseInt(formData.district) : undefined,
        commune: formData.commune ? parseInt(formData.commune) : undefined,
        village: formData.village ? parseInt(formData.village) : undefined,
      };

      if (student) {
        await axios.patch(`http://localhost:3001/students/${student.id}`, payload);
      } else {
        await axios.post('http://localhost:3001/students', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please check the data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Phone</label>
              <input 
                type="text" 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Date of Birth</label>
              <input 
                type="date" 
                required 
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Assign Classroom</label>
            <select 
              value={formData.classroomId}
              onChange={(e) => setFormData({...formData, classroomId: e.target.value})}
            >
              <option value="">Select a class...</option>
              {Array.isArray(classes) && classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Province</label>
              <select value={formData.province} onChange={handleProvinceChange}>
                <option value="">Select Province</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name_km} ({p.name_en})</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>District</label>
              <select value={formData.district} onChange={handleDistrictChange} disabled={!formData.province}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name_km} ({d.name_en})</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Commune</label>
              <select value={formData.commune} onChange={handleCommuneChange} disabled={!formData.district}>
                <option value="">Select Commune</option>
                {communes.map(c => <option key={c.id} value={c.id}>{c.name_km} ({c.name_en})</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Village</label>
              <select 
                value={formData.village} 
                onChange={(e) => setFormData({...formData, village: e.target.value})}
                disabled={!formData.commune}
              >
                <option value="">Select Village</option>
                {villages.map(v => <option key={v.id} value={v.id}>{v.name_km} ({v.name_en})</option>)}
              </select>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
