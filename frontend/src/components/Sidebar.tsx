'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, 
  Settings, ShieldCheck, UserCog, LogOut, 
  CalendarCheck, BookOpen, BarChart3, ChevronDown, Circle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'dashboard', path: '/', icon: LayoutDashboard },
  { name: 'attendance', path: '/attendance', icon: CalendarCheck },
  { name: 'students', path: '/students', icon: Users },
  { name: 'promotions', path: '/students/promotions', icon: GraduationCap },
  { name: 'teachers', path: '/teachers', icon: UserSquare2 },
  { name: 'classes', path: '/classes', icon: GraduationCap },
  { name: 'subjects', path: '/subjects', icon: BookOpen },
  { 
    name: 'reports', 
    path: '/reports', 
    icon: BarChart3,
    subItems: [
      { name: 'attendanceReport', path: '/attendance/report', icon: CalendarCheck },
      { name: 'studentReport', path: '/reports/students', icon: Users },
      { name: 'teacherReport', path: '/reports/teachers', icon: UserSquare2 },
    ]
  },
  { name: 'users', path: '/users', icon: UserCog },
  { name: 'roles', path: '/roles', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<string[]>(['reports']);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>SMS</div>
        <span className={styles.logoText}>{language === 'en' ? 'Academy' : 'សាលា'}</span>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = pathname === item.path || (hasSubItems && item.subItems?.some(si => pathname === si.path));
          
          return (
            <div key={item.name}>
              {hasSubItems ? (
                <div 
                  className={`${styles.navItem} ${isActive ? styles.active : ''} ${isExpanded ? styles.expanded : ''}`}
                  onClick={() => toggleExpand(item.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon size={20} />
                  <span>{t(item.name)}</span>
                  <ChevronDown size={16} className={styles.expandIcon} />
                </div>
              ) : (
                <Link 
                  href={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <Icon size={20} />
                  <span>{t(item.name)}</span>
                </Link>
              )}

              {hasSubItems && isExpanded && (
                <div className={styles.submenu}>
                  {item.subItems?.map(sub => {
                    const SubIcon = sub.icon || Circle;
                    return (
                      <Link 
                        key={sub.path} 
                        href={sub.path}
                        className={`${styles.subItem} ${pathname === sub.path ? styles.activeSub : ''}`}
                      >
                        <SubIcon size={14} />
                        <span>{t(sub.name)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
