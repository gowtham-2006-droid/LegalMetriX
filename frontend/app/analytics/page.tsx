'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Star,
  Clock,
  ChevronDown,
  TrendingUp,
  MapPin,
  Lightbulb,
  Info,
  Loader2
} from 'lucide-react';
import { IndiaEmblem } from '@/components/Logo';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/analytics', { headers });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [period]);

  const summary = analytics?.summary || {
    total_inspections: 3,
    compliant_count: 2,
    non_compliant_count: 1,
    review_count: 1,
    compliance_rate: 66.7,
    average_weighted_score: 82.0
  };

  const commonViolations = analytics?.common_violations || [
    { field: 'consumer_care', count: 1 },
    { field: 'date_mfg_pkd', count: 1 }
  ];

  const categories = analytics?.categories || [
    { category: 'all_packaged_food', count: 3 }
  ];

  const total = summary.total_inspections || 1;
  const compliantCount = summary.compliant_count;
  const nonCompliantCount = summary.non_compliant_count;
  const compPct = summary.compliance_rate || 71.5;
  const nonCompPct = Math.round((100 - compPct) * 10) / 10;

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a6ef5'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Compliance Analytics
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Insights from database inspections to strengthen enforcement and consumer protection.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Timeframe Toggles */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 8, padding: 2 }}>
            {(['7D', '30D', '3M', '1Y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  border: 'none',
                  background: period === p ? '#1a6ef5' : 'transparent',
                  color: period === p ? '#ffffff' : '#64748b',
                  borderRadius: 6,
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}
          >
            <Download size={14} />
            Export Report
          </button>

          <IndiaEmblem height={34} invert={false} />
        </div>
      </div>

      {/* Row 1: 5 Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <FileText size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Inspections</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
            {summary.total_inspections}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
            Live records analyzed
          </span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>{compPct}%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Compliant Products</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
            {compliantCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Verified pass</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444' }}>{nonCompPct}%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Potential Violations</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
            {nonCompliantCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Requires action</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Star size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Compliance Score</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
            {Math.round(summary.average_weighted_score)}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Quality benchmark</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Clock size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Pending Review</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>
            {summary.review_count}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Active queue</span>
        </div>
      </div>

      {/* Row 2: Inspection Trend + Compliance Rate Donut + Violation Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Inspection Trend Line Spline Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Inspection Trend</h3>
            <span style={{ fontSize: '0.75rem', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 4, padding: '0.15rem 0.45rem' }}>
              Daily ▾
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a6ef5' }} /> Total Inspections</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Compliant</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Non-Compliant</span>
          </div>

          <div style={{ height: 160, width: '100%' }}>
            <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%' }}>
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" />

              <path d="M 10 70 Q 70 30, 130 65 T 250 45 T 370 30 T 490 55" fill="none" stroke="#1a6ef5" strokeWidth="2.2" />
              <path d="M 10 90 Q 70 65, 130 85 T 250 65 T 370 50 T 490 75" fill="none" stroke="#10b981" strokeWidth="2.2" />
              <path d="M 10 120 Q 70 110, 130 115 T 250 110 T 370 115 T 490 115" fill="none" stroke="#ef4444" strokeWidth="2.2" />

              <text x="10" y="135" fontSize="9" fill="#94a3b8">1 Sep</text>
              <text x="105" y="135" fontSize="9" fill="#94a3b8">3 Sep</text>
              <text x="200" y="135" fontSize="9" fill="#94a3b8">5 Sep</text>
              <text x="295" y="135" fontSize="9" fill="#94a3b8">7 Sep</text>
              <text x="390" y="135" fontSize="9" fill="#94a3b8">9 Sep</text>
              <text x="460" y="135" fontSize="9" fill="#94a3b8">11 Sep</text>
            </svg>
          </div>
        </div>

        {/* Compliance Rate Donut */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, alignSelf: 'flex-start', marginBottom: '0.5rem', margin: 0 }}>Compliance Rate</h3>
          <div style={{ position: 'relative', width: 110, height: 110, margin: '0.5rem 0' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${compPct} 100`} />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${nonCompPct} 100`} strokeDashoffset={`-${compPct}`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{compPct}%</span>
              <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Compliant</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span>Compliant: <strong>{compliantCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
              <span>Issues: <strong>{nonCompliantCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Violation Distribution Bars */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', margin: 0 }}>Common Violations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {commonViolations.map((v: any, idx: number) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
                  <span style={{ color: '#475569', textTransform: 'capitalize' }}>
                    {v.field.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>{v.count} violations</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(v.count * 40, 100)}%`, height: '100%', background: '#ef4444', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
