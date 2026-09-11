'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
