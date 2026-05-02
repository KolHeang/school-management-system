'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import styles from '../../students/create/create.module.css';
import { Teacher } from '@/types';

export default function CreateClassPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacherId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

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
      await axios.post('http://localhost:3001/classrooms', payload);
      router.push('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ChevronLeft size={20} />
          <span>Back to List</span>
        </button>
        <h1 className={styles.title}>Add New Classroom</h1>
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
                  <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              <Save size={20} />
              <span>{isLoading ? 'Creating...' : 'Create Class'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
