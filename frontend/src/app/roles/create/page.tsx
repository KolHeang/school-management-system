'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import styles from '../../students/create/create.module.css';
import { Permission } from '@/types';

export default function CreateRolePage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    permissionIds: [] as number[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/permissions');
      if (Array.isArray(response.data)) {
        setPermissions(response.data);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    }
  };

  const handlePermissionToggle = (id: number) => {
    setFormData(prev => {
      const ids = prev.permissionIds.includes(id)
        ? prev.permissionIds.filter(pid => pid !== id)
        : [...prev.permissionIds, id];
      return { ...prev, permissionIds: ids };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3001/roles', formData);
      router.push('/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role.');
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
        <h1 className={styles.title}>Add New Role</h1>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Role Details</h3>
            <div className={styles.inputGroup}>
              <label>Role Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Moderator"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '24px' }}>
              <label>Assign Permissions</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                {Array.isArray(permissions) && permissions.map(p => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', background: formData.permissionIds.includes(p.id) ? '#f0f4ff' : '#f8fafc' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.permissionIds.includes(p.id)}
                      onChange={() => handlePermissionToggle(p.id)}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              <Save size={20} />
              <span>{isLoading ? 'Creating...' : 'Create Role'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
