'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserSquare2, GraduationCap, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback or handle error
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, Admin</h1>
          <p className={styles.subtitle}>Here is what's happening today.</p>
        </div>
        <div className={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          color="#6366f1" 
        />
        <StatCard 
          title="Total Teachers" 
          value={stats.totalTeachers} 
          icon={UserSquare2} 
          color="#10b981" 
        />
        <StatCard 
          title="Total Classes" 
          value={stats.totalClassrooms} 
          icon={GraduationCap} 
          color="#f59e0b" 
        />
        <StatCard 
          title="Attendance Rate" 
          value="98.5%" 
          icon={TrendingUp} 
          color="#ec4899" 
        />
      </section>

      <section className={styles.mainContent}>
        <div className={`glass ${styles.recentActivity}`}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.placeholder}>
            <p>No recent activity to show.</p>
          </div>
        </div>
        
        <div className={`glass ${styles.upcomingEvents}`}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.placeholder}>
            <p>No upcoming events.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
