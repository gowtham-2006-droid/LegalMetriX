'use client';

import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, UserCheck, ShieldAlert, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [userRole, setUserRole] = useState<'inspector' | 'admin'>('inspector');
  const [userName, setUserName] = useState('Inspector-01');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('metrology_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUserRole(u.role || 'inspector');
        setUserName(u.name || (u.role === 'admin' ? 'Admin Officer' : 'R. Kumar'));
      } catch (e) {}
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('metrology_token');
    localStorage.removeItem('metrology_user');
    setMenuOpen(false);
  };

  const switchRole = (role: 'inspector' | 'admin') => {
    const newName = role === 'admin' ? 'Admin Officer' : 'R. Kumar';
    setUserRole(role);
    setUserName(newName);
    localStorage.setItem('metrology_user', JSON.stringify({ role, name: newName }));
    setMenuOpen(false);
  };


  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Can be customized per page or rendered empty */}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
        {/* Notification Bell */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Notifications"
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            border: '2px solid #ffffff'
          }} />
        </button>

        {/* User Pill */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: userRole === 'admin' ? '#7c3aed' : '#1e3a8a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            {userRole === 'admin' ? 'A' : 'I'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
            {userName}
          </span>
          <ChevronDown size={14} color="#64748b" />
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 48,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            width: 220,
            zIndex: 50,
            padding: '0.5rem'
          }}>
            <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>Switch Role (Demo)</p>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Current: {userRole}</p>
            </div>

            <button
              onClick={() => switchRole('inspector')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: 'none',
                background: userRole === 'inspector' ? '#eff6ff' : 'none',
                color: userRole === 'inspector' ? '#1d4ed8' : '#334155',
                borderRadius: '6px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <UserCheck size={16} />
              Inspector View
            </button>

            <button
              onClick={() => switchRole('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: 'none',
                background: userRole === 'admin' ? '#faf5ff' : 'none',
                color: userRole === 'admin' ? '#7c3aed' : '#334155',
                borderRadius: '6px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <ShieldAlert size={16} />
              Administrator View
            </button>

            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
              <Link
                href="/login"
                onClick={handleSignOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  borderRadius: '6px'
                }}
              >
                <LogOut size={16} />
                Sign Out
              </Link>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
