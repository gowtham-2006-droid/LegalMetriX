'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Scan,
  Brain,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Server,
  LockKeyhole
} from 'lucide-react';
import { LegalMetrixLogo, IndiaEmblem } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'inspector' | 'admin'>('inspector');
  const [email, setEmail] = useState('inspector@sih.gov.in');
  const [password, setPassword] = useState('inspector123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (newRole: 'inspector' | 'admin') => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'inspector') {
      setEmail('inspector@sih.gov.in');
      setPassword('inspector123');
    } else {
      setEmail('admin@sih.gov.in');
      setPassword('admin123');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(errData.detail || 'Invalid email or password');
      }

      const data = await res.json();
      localStorage.setItem('metrology_token', data.access_token);
      localStorage.setItem('metrology_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication service');
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      backgroundColor: '#f8fafc',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* LEFT HERO PANEL (Deep Blue Shelf Showcase) */}
      <div style={{
        background: 'radial-gradient(ellipse at top left, #173b75 0%, #0c1c38 60%, #071124 100%)',
        color: '#ffffff',
        padding: '3.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          background: 'rgba(56, 189, 248, 0.12)',
          filter: 'blur(90px)',
          borderRadius: '50%',
          top: -50,
          left: -50,
          pointerEvents: 'none'
        }} />

        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.6rem' }}>
            <LegalMetrixLogo size={46} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Legal<span style={{ color: '#38bdf8' }}>MetriX</span>
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#93c5fd', marginBottom: '0.75rem' }}>
            AI-Powered Compliance Inspection System
          </p>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: 480, lineHeight: 1.5 }}>
            Ensuring safe, fair and compliant packaged commodities through the power of AI, Computer Vision and Legal Metrology rules.
          </p>

          {/* 4 Feature Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '2rem' }}>
            {[
              { label: 'Image Analysis', icon: Camera },
              { label: 'OCR & Text Extraction', icon: Scan },
              { label: 'AI-Powered Extraction', icon: Brain },
              { label: 'Rule-Based Compliance', icon: ShieldCheck },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.4rem'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#e2e8f0', lineHeight: 1.2 }}>
                    {feat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Visual Showcase: Commodity Packages with AI Bounding Box Overlays */}
        <div style={{
          position: 'relative',
          margin: '2rem 0',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '1rem',
          minHeight: 260
        }}>
          {/* Marie Biscuits Mock */}
          <div style={{
            position: 'relative',
            width: 170,
            background: 'linear-gradient(135deg, #f59e0b, #b45309)',
            borderRadius: 8,
            padding: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            border: '2px solid #38bdf8'
          }}>
            <div style={{
              position: 'absolute',
              top: -28,
              left: 0,
              background: '#0284c7',
              color: '#ffffff',
              padding: '0.15rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              MRP: ₹50
            </div>
            <div style={{ background: '#b91c1c', color: 'white', padding: '0.2rem', borderRadius: 4, textAlign: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
              Marie
            </div>
            <p style={{ fontSize: '0.65rem', textAlign: 'center', color: '#fef08a', marginTop: 4 }}>BISCUITS</p>
            <p style={{ fontSize: '0.65rem', color: '#ffffff', marginTop: 8 }}>Net Wt. 200 g</p>
          </div>

          {/* Oil Bottle Mock */}
          <div style={{
            width: 70,
            height: 150,
            background: 'linear-gradient(180deg, #fef08a 0%, #ca8a04 100%)',
            borderRadius: '20px 20px 10px 10px',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{ width: 24, height: 16, background: '#eab308', borderRadius: 4, marginTop: -10 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#713f12', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
              Cooking Oil
            </span>
          </div>

          {/* Premium Rice Mock */}
          <div style={{
            position: 'relative',
            width: 140,
            height: 170,
            background: 'linear-gradient(135deg, #065f46, #047857)',
            borderRadius: 10,
            padding: '1rem',
            border: '2px solid #06b6d4',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              position: 'absolute',
              top: -26,
              right: 0,
              background: '#06b6d4',
              color: '#ffffff',
              padding: '0.15rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              Net Qty: 5 kg
            </div>
            <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>Premium Rice</p>
            <p style={{ fontSize: '0.7rem', color: '#a7f3d0', marginTop: 30 }}>Pure Basmati</p>
            <p style={{ fontSize: '0.65rem', color: '#e2e8f0', marginTop: 15 }}>Net Wt. 5 kg</p>
          </div>

          {/* Whole Wheat Flour Mock */}
          <div style={{
            width: 110,
            height: 140,
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            borderRadius: 8,
            padding: '0.85rem',
            color: '#ffffff',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.75rem' }}>Whole Wheat Flour</p>
            <p style={{ fontSize: '0.65rem', color: '#bfdbfe', marginTop: 24 }}>Net Wt. 1 kg</p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.82rem',
          color: '#94a3b8',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1rem'
        }}>
          <Shield size={16} color="#38bdf8" />
          <span>Smarter Inspections</span>
          <span>|</span>
          <span>Safer Consumers</span>
          <span>|</span>
          <span>Stronger India</span>
        </div>
      </div>

      {/* RIGHT AUTH CARD PANEL */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        position: 'relative'
      }}>
        {/* Top Ministry Emblem */}
        <div style={{ position: 'absolute', top: '2rem', right: '3rem' }}>
          <IndiaEmblem height={40} invert={false} />
        </div>

        {/* White Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.06), 0 2px 6px -1px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          width: '100%',
          maxWidth: 440,
          padding: '2.5rem 2.25rem'
        }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.75rem' }}>
            Sign in to your account to continue
          </p>

          {/* Role Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: '#f1f5f9',
            padding: '0.3rem',
            borderRadius: 10,
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('inspector')}
              style={{
                padding: '0.65rem',
                borderRadius: 8,
                border: 'none',
                background: role === 'inspector' ? '#1a6ef5' : 'transparent',
                color: role === 'inspector' ? '#ffffff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={16} />
              Inspector
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                padding: '0.65rem',
                borderRadius: 8,
                border: 'none',
                background: role === 'admin' ? '#1a6ef5' : 'transparent',
                color: role === 'admin' ? '#ffffff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Server size={16} />
              Administrator
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn}>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Email / Username
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#1a6ef5' }}
                />
                Remember me
              </label>
              <a href="#" style={{ color: '#1a6ef5', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={17} />
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem' }}>
              Don't have an account?{' '}
              <a href="#" style={{ color: '#1a6ef5', fontWeight: 600 }}>Contact your administrator</a>
            </p>
          </form>

          {/* Footer Security Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.72rem',
            color: '#64748b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={13} color="#10b981" /> Secure Access
            </span>
            <span>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <LockKeyhole size={13} color="#1a6ef5" /> Role Based Access
            </span>
            <span>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Server size={13} color="#6366f1" /> Government Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
