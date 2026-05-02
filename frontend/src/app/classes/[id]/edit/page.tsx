'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import styles from '../../../students/create/create.module.css';
import { Teacher } from '@/types';

export default function EditClassPage() {
  const router = useRouter();
  const { id } = useParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacherId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeachers();
      fetchClassroom();
    }
  }, [id]);

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

  const fetchClassroom = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/classrooms/${id}`);
      const classroom = response.data;
      setFormData({
        name: classroom.name,
        grade: classroom.grade,
        teacherId: classroom.teacher?.id.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      router.push('/classes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined
      };
      await axios.patch(`http://localhost:3001/classrooms/${id}`, payload);
      router.push('/classes');
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>Back to List</span>
        </button>
        <h1 className={styles.title}>Edit Classroom</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Classroom Information</h3>
            <div className={styles.inputGroup}>
              <label>Class Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Grade Level</label>
              <input 
                type="text" 
                required 
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
                  <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              <Save size={20} />
              <span>{isSaving ? 'Saving...' : 'Update Class'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
