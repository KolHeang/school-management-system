'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from '../students/page.module.css';
import { Role } from '@/types';

export default function RolesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'name', label: t('roleName') },
    {
      key: 'permissions',
      label: t('permissionCount'),
      render: (perms: any[]) => perms ? perms.length : 0
    },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`http://localhost:3001/roles/${id}`);
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role.');
      }
    }
  };

  const handleEdit = (role: Role) => {
    router.push(`/roles/${role.id}/edit`);
  };

  const handleAdd = () => {
    router.push('/roles/create');
  };

  const filtered = Array.isArray(roles) ? roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('roles')}</h1>
          <p className={styles.subtitle}>{t('roleSubtitle')}</p>
        </div>
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={20} />
          <span>{t('add')}</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('search')}
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        t={t}
      />
    </div>
  );
}
