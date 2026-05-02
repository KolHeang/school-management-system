'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div style={{ display: 'flex' }}>
      {!isLoginPage && <Sidebar />}
      <div style={{ 
        flex: 1, 
        marginLeft: isLoginPage ? '0' : '260px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)'
      }}>
        {!isLoginPage && <Navbar />}
        <main style={{ 
          padding: isLoginPage ? '0' : '40px',
          flex: 1
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
