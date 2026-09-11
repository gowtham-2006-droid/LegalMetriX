import React from 'react';

export function LegalMetrixLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(14, 165, 233, 0.35)',
      flexShrink: 0
    }}>
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 7L12 12L3 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 4.5L7.5 9.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export function IndiaEmblem({ height = 36, invert = true }: { height?: number; invert?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg width={height * 0.8} height={height} viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stylized Ashoka Lion Capital Vector */}
        <circle cx="15" cy="8" r="5" fill={invert ? "#cbd5e1" : "#475569"} />
        <rect x="8" y="14" width="14" height="12" rx="2" fill={invert ? "#cbd5e1" : "#475569"} />
        <circle cx="15" cy="20" r="3" fill={invert ? "#0d1726" : "#ffffff"} />
        <rect x="5" y="28" width="20" height="3" rx="1" fill={invert ? "#cbd5e1" : "#475569"} />
        <rect x="2" y="33" width="26" height="3" rx="1" fill={invert ? "#94a3b8" : "#64748b"} />
      </svg>
      <div style={{ lineHeight: 1.15 }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: invert ? '#f8fafc' : '#1e293b' }}>
          Government of India
        </p>
        <p style={{ fontSize: '0.6rem', color: invert ? '#94a3b8' : '#64748b' }}>
          Ministry of Consumer Affairs,<br />Food & Public Distribution
        </p>
      </div>
    </div>
  );
}
