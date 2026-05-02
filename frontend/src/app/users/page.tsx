'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DataTable from '@/components/DataTable';
import styles from '../students/page.module.css';
import { User } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'username', label: t('username') },
    {
      key: 'role',
      label: t('roles'),
      render: (role: any) => role ? role.name : t('noRole')
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleAdd = () => {
    router.push('/users/create');
  };

  const filtered = Array.isArray(users) ? users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('users')}</h1>
          <p className={styles.subtitle}>{t('userSubtitle')}</p>
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
