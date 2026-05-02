'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import styles from '../../../students/create/create.module.css';
import { Role } from '@/types';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roleId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRoles();
      fetchUser();
    }
  }, [id]);

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

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      const user = response.data;
      setFormData({
        username: user.username,
        password: '',
        roleId: user.role?.id.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: any = {
        username: formData.username,
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined
      };
      if (formData.password) payload.password = formData.password;

      await axios.patch(`http://localhost:3001/users/${id}`, payload);
      router.push('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
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
        <h1 className={styles.title}>Edit User</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Account Information</h3>
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
              <label>Password (Leave blank to keep current)</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Assign Role</label>
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
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              <Save size={20} />
              <span>{isSaving ? 'Saving...' : 'Update User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
