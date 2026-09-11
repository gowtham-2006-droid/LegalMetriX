'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Camera,
  History,
  BarChart3,
  FileText,
  Database,
  Scale,
  Users,
  Settings
} from 'lucide-react';
import { LegalMetrixLogo, IndiaEmblem } from './Logo';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Inspection', href: '/inspections/new', icon: Camera },
    { label: 'Inspection History', href: '/history', icon: History },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Products Database', href: '/products', icon: Database },
    { label: 'Legal Metrology Rules', href: '/admin/rules', icon: Scale },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-logo-area">
        <LegalMetrixLogo size={34} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Legal<span style={{ color: '#38bdf8' }}>MetriX</span>
            </span>
          </div>
          <p style={{ fontSize: '0.62rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            AI-Powered Compliance Inspection System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Active check
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Government of India Bottom Seal */}
      <div className="sidebar-footer">
        <IndiaEmblem height={32} invert={true} />
      </div>
    </aside>
  );
}
