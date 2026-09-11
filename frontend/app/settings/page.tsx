'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Lock,
  Bell,
  Edit2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  LogOut,
  Camera,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [notifications, setNotifications] = useState({
    inspectionUpdates: true,
    ruleUpdates: true,
    systemAnnouncements: true
  });

  const [passwordSaved, setPasswordSaved] = useState(false);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
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
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Profile & Settings
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Settings Panels & Right Profile Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Personal Information */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: '#2563eb' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Personal Information
                </h2>
              </div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={13} />
                Edit
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Full Name</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>R. Kumar</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Email Address</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>inspector01@gov.in</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Phone Number</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>+91 98765 43210</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Role</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Inspector</span>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: '#2563eb' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Organization Details
                </h2>
              </div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={13} />
                Edit
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Department</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Legal Metrology Department</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Organization</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  Ministry of Consumer Affairs, Food & Public Distribution
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>State / Region</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Maharashtra</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <span style={{ color: '#64748b', fontWeight: 500 }}>Office Location</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Vile Parle, Mumbai</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Lock size={18} style={{ color: '#2563eb' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Change Password
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                <label style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    placeholder="Enter current password"
                    style={{
                      width: '100%',
                      padding: '9px 36px 9px 12px',
                      fontSize: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                <label style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: '9px 36px 9px 12px',
                      fontSize: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                <label style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: '9px 36px 9px 12px',
                      fontSize: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center', marginTop: '6px' }}>
                <div></div>
                <button
                  onClick={() => {
                    setPasswordSaved(true);
                    setTimeout(() => setPasswordSaved(false), 3000);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: 'fit-content',
                    padding: '9px 18px',
                    backgroundColor: '#1a6ef5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={15} />
                  {passwordSaved ? 'Password Updated!' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Bell size={18} style={{ color: '#2563eb' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Notification Preferences
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Inspection Updates</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Get notified about inspection status and results</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif('inspectionUpdates')}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: notifications.inspectionUpdates ? '#1a6ef5' : '#cbd5e1',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: notifications.inspectionUpdates ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Rule Updates</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Get notified when legal metrology rules are updated</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif('ruleUpdates')}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: notifications.ruleUpdates ? '#1a6ef5' : '#cbd5e1',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: notifications.ruleUpdates ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>System Announcements</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Get important updates and announcements</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif('systemAnnouncements')}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: notifications.systemAnnouncements ? '#1a6ef5' : '#cbd5e1',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: notifications.systemAnnouncements ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Profile Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          {/* Avatar with Camera Icon */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#264653',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700
              }}
            >
              I
            </div>
            <button
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#1a6ef5',
                color: '#ffffff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Camera size={14} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            R. Kumar
          </h2>
          <span style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
            Inspector
          </span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginTop: '10px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
            Active
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9', margin: '20px 0' }} />

          {/* Contact Details List */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Mail size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-all' }}>inspector01@gov.in</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Phone size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <span>+91 98765 43210</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Building2 size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <span>Legal Metrology Department</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <MapPin size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <span>Vile Parle, Mumbai, Maharashtra</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9', margin: '20px 0' }} />

          {/* Metadata */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Calendar size={16} style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#64748b' }}>Member Since</div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>01 Aug 2025</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Clock size={16} style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#64748b' }}>Last Login</div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>11 Sep 2025, 10:24 AM</div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Link
            href="/login"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              marginTop: '24px',
              border: '1px solid #fee2e2',
              backgroundColor: '#fff5f5',
              color: '#ef4444',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
