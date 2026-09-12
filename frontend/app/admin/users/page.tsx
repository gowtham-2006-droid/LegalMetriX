'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, ShieldCheck, Mail, Phone, MoreVertical, CheckCircle2 } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Inspector';
  zone: string;
  status: 'Active' | 'Inactive';
  inspectionsConducted: number;
  lastActive: string;
}

const mockUsers: UserRecord[] = [
  {
    id: 'USR-01',
    name: 'R. Kumar',
    email: 'inspector01@gov.in',
    role: 'Inspector',
    zone: 'Mumbai Metro Zone (MH)',
    status: 'Active',
    inspectionsConducted: 428,
    lastActive: 'Just now'
  },
  {
    id: 'USR-02',
    name: 'P. Sharma',
    email: 'inspector02@gov.in',
    role: 'Inspector',
    zone: 'Pune & Western Region (MH)',
    status: 'Active',
    inspectionsConducted: 312,
    lastActive: '2 hours ago'
  },
  {
    id: 'USR-03',
    name: 'Dr. V. Rao',
    email: 'admin01@gov.in',
    role: 'Admin',
    zone: 'National Head Office, New Delhi',
    status: 'Active',
    inspectionsConducted: 0,
    lastActive: '10 mins ago'
  },
  {
    id: 'USR-04',
    name: 'S. Patel',
    email: 'inspector03@gov.in',
    role: 'Inspector',
    zone: 'Ahmedabad South Zone (GJ)',
    status: 'Active',
    inspectionsConducted: 264,
    lastActive: 'Yesterday'
  }
];

export default function UsersRolesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Users & Roles Management
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Enforce role-based access control (RBAC) across officers, inspectors, and system administrators.
            </p>
          </div>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a6ef5',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <UserPlus size={16} />
          Add Official
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-4-cols" style={{ gap: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Inspectors</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>18</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>System Admins</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>4</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Enforcement Zones</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>12</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Audit Logs (24h)</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>142 Events</div>
        </div>
      </div>

      {/* Table Card */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Registered Officials</h2>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search officials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                fontSize: '0.82rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Official</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>Jurisdiction / Zone</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Inspections Conducted</th>
                <th style={{ padding: '12px 16px' }}>Last Active</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: user.role === 'Admin' ? '#312e81' : '#1e3a8a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        {user.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: user.role === 'Admin' ? '#f5f3ff' : '#eff6ff',
                        color: user.role === 'Admin' ? '#7c3aed' : '#2563eb'
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>{user.zone}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: '#dcfce7',
                        color: '#16a34a'
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: 600 }}>{user.inspectionsConducted}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{user.lastActive}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#94a3b8' }}>
                    <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
