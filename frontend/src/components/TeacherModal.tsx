'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { Teacher } from '@/types';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher?: Teacher | null;
}

export default function TeacherModal({ isOpen, onClose, onSuccess, teacher }: TeacherModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (teacher) {
        setFormData({
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          subject: teacher.subject,
          bio: teacher.bio || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          bio: ''
        });
      }
    }
  }, [isOpen, teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (teacher) {
        await axios.patch(`http://localhost:3001/teachers/${teacher.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/teachers', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
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

          <div className={styles.inputGroup}>
            <label>Subject</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Biography</label>
            <textarea 
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
