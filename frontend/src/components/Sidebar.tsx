'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, UserSquare2, GraduationCap, Settings, ShieldCheck, UserCog, LogOut, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'dashboard', path: '/', icon: LayoutDashboard },
  { name: 'attendance', path: '/attendance', icon: CalendarCheck },
  { name: 'students', path: '/students', icon: Users },
  { name: 'teachers', path: '/teachers', icon: UserSquare2 },
  { name: 'classes', path: '/classes', icon: GraduationCap },
  { name: 'users', path: '/users', icon: UserCog },
  { name: 'roles', path: '/roles', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>SMS</div>
        <span className={styles.logoText}>Academy</span>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{t(item.name)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
