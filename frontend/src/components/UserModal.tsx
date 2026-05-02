'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { User, Role } from '@/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      if (user) {
        setFormData({
          username: user.username,
          password: '', // Don't show existing password
          roleId: user.role?.id.toString() || ''
        });
      } else {
        setFormData({
          username: '',
          password: '',
          roleId: ''
        });
      }
    }
  }, [isOpen, user]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/roles');
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: any = {
        username: formData.username,
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      if (user) {
        await axios.patch(`http://localhost:3001/users/${user.id}`, payload);
      } else {
        if (!formData.password) {
          alert('Password is required for new users.');
          setIsLoading(false);
          return;
        }
        await axios.post('http://localhost:3001/users', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input 
              type="text" 
              required 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password {user && '(Leave blank to keep current)'}</label>
            <input 
              type="password" 
              required={!user}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Role</label>
            <select 
              value={formData.roleId}
              onChange={(e) => setFormData({...formData, roleId: e.target.value})}
            >
              <option value="">Select a role...</option>
              {Array.isArray(roles) && roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
