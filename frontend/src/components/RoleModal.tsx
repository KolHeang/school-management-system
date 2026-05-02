'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { Role, Permission } from '@/types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: Role | null;
}

export default function RoleModal({ isOpen, onClose, onSuccess, role }: RoleModalProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    permissionIds: [] as number[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPermissions();
      if (role) {
        setFormData({
          name: role.name,
          permissionIds: role.permissions?.map(p => p.id) || []
        });
      } else {
        setFormData({
          name: '',
          permissionIds: []
        });
      }
    }
  }, [isOpen, role]);

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
      if (role) {
        await axios.patch(`http://localhost:3001/roles/${role.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/roles', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{role ? 'Edit Role' : 'Add New Role'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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

          <div className={styles.inputGroup}>
            <label>Assign Permissions</label>
            <div className={styles.permissionList} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
              {Array.isArray(permissions) && permissions.map(p => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', cursor: 'pointer' }}>
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

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
