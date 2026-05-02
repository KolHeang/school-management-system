'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { Classroom, Teacher } from '@/types';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classroom?: Classroom | null;
}

export default function ClassModal({ isOpen, onClose, onSuccess, classroom }: ClassModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacherId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      if (classroom) {
        setFormData({
          name: classroom.name,
          grade: classroom.grade,
          teacherId: classroom.teacher?.id.toString() || ''
        });
      } else {
        setFormData({
          name: '',
          grade: '',
          teacherId: ''
        });
      }
    }
  }, [isOpen, classroom]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/teachers');
      if (Array.isArray(response.data)) {
        setTeachers(response.data);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined
      };

      if (classroom) {
        await axios.patch(`http://localhost:3001/classrooms/${classroom.id}`, payload);
      } else {
        await axios.post('http://localhost:3001/classrooms', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{classroom ? 'Edit Class' : 'Add New Class'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Class Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Grade 10 A"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Grade Level</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. 10"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Assign Teacher</label>
            <select 
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
            >
              <option value="">Select a teacher...</option>
              {Array.isArray(teachers) && teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.full_name_en || t.full_name_kh} {t.subjects && t.subjects.length > 0 ? `(${t.subjects.map(s => s.name_en).join(', ')})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
