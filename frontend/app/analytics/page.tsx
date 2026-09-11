'use client';

import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { IndiaEmblem } from '@/components/Logo';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');

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
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Analytics
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Insights from inspections to strengthen compliance and consumer protection.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Date Range Picker */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '0.4rem 0.75rem',
            fontSize: '0.78rem',
            color: '#334155'
          }}>
            <Calendar size={14} color="#64748b" />
            <span>01 Sep 2025 - 11 Sep 2025</span>
            <ChevronDown size={14} color="#64748b" />
          </div>

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

          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}>
            <Download size={14} />
            Export Report
          </button>

          <IndiaEmblem height={34} invert={false} />
        </div>
      </div>

      {/* Row 1: 5 Top Metric Cards matching Image 10 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <FileText size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Inspections</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>1,248</div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 18% <span style={{ color: '#94a3b8' }}>vs previous month</span></span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>71.5%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Compliant Products</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>892</div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 12% <span style={{ color: '#94a3b8' }}>vs previous month</span></span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444' }}>28.5%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Potential Violations</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>356</div>
          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>↓ 6% <span style={{ color: '#94a3b8' }}>vs previous month</span></span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Star size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Compliance Score</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>78%</div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 8% <span style={{ color: '#94a3b8' }}>vs previous month</span></span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Clock size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Pending Review</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.15rem 0' }}>42</div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 5% <span style={{ color: '#94a3b8' }}>vs previous month</span></span>
        </div>
      </div>

      {/* Row 2: Inspection Trend (1.8fr) + Compliance Rate Donut (1fr) + Violation Distribution (1.2fr) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Inspection Trend 3-Line Spline Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Inspection Trend</h3>
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

              {/* Blue Total Line */}
              <path d="M 10 70 Q 70 30, 130 65 T 250 45 T 370 30 T 490 55" fill="none" stroke="#1a6ef5" strokeWidth="2.2" />
              {/* Green Compliant Line */}
              <path d="M 10 90 Q 70 65, 130 85 T 250 65 T 370 50 T 490 75" fill="none" stroke="#10b981" strokeWidth="2.2" />
              {/* Red Non-Compliant Line */}
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
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, alignSelf: 'flex-start', marginBottom: '0.5rem' }}>Compliance Rate</h3>
          <div style={{ position: 'relative', width: 110, height: 110, margin: '0.5rem 0' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="71.5 100" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="28.5 100" strokeDashoffset="-71.5" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>71.5%</span>
              <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Compliant</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              <span>Compliant: <strong>892 (71.5%)</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
              <span>Non-Compliant: <strong>356 (28.5%)</strong></span>
            </div>
          </div>
        </div>

        {/* Violation Distribution Bars */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Violation Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
            {[
              { name: 'Consumer Care Information', pct: 32, color: '#ef4444' },
              { name: 'MRP Declaration', pct: 21, color: '#f97316' },
              { name: 'Net Quantity', pct: 15, color: '#f59e0b' },
              { name: 'Manufacturer Details', pct: 11, color: '#6366f1' },
              { name: 'Date / Best Before', pct: 8, color: '#8b5cf6' },
              { name: 'Country of Origin', pct: 7, color: '#06b6d4' },
              { name: 'Other Violations', pct: 6, color: '#94a3b8' },
            ].map((v) => (
              <div key={v.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ color: '#334155' }}>{v.name}</span>
                  <span style={{ fontWeight: 600 }}>{v.pct}%</span>
                </div>
                <div style={{ width: '100%', height: 5, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ width: `${v.pct * 2.5}%`, height: '100%', background: v.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Category Donut + Monthly Trend Bar + Top 10 Products Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.6fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Category Breakdown Donut */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Inspections by Product Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
            {[
              { name: 'Food & Beverages', count: '542 (43%)', color: '#1d4ed8' },
              { name: 'Staples', count: '268 (21%)', color: '#0284c7' },
              { name: 'Edible Oil', count: '156 (12%)', color: '#06b6d4' },
              { name: 'Dairy Products', count: '98 (8%)', color: '#10b981' },
              { name: 'Personal Care', count: '76 (6%)', color: '#8b5cf6' },
              { name: 'Home Care', count: '56 (4%)', color: '#ec4899' },
              { name: 'Others', count: '52 (4%)', color: '#94a3b8' }
            ].map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                  <span style={{ color: '#334155' }}>{c.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Compliance Trend Bar */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Monthly Compliance Trend</h3>
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '1rem' }}>
            {[
              { m: 'Jun', val: 320, h: 45 },
              { m: 'Jul', val: 410, h: 60 },
              { m: 'Aug', val: 468, h: 72 },
              { m: 'Sep', val: '1,248', h: 100 }
            ].map(b => (
              <div key={b.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a6ef5' }}>{b.val}</span>
                <div style={{ width: 34, height: `${b.h * 1.2}px`, background: '#1a6ef5', borderRadius: '4px 4px 0 0' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Products with Violations */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Top 10 Products with Violations</h3>
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.72rem' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Inspections</th>
                  <th>Violations</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, p: 'Parle-G Biscuits', insp: 124, viol: 48, r: '38.7%' },
                  { n: 2, p: 'Maggi Noodles', insp: 98, viol: 32, r: '32.7%' },
                  { n: 3, p: 'Fortune Sunflower Oil', insp: 76, viol: 25, r: '32.9%' },
                  { n: 4, p: 'Aashirvaad Atta', insp: 64, viol: 18, r: '28.1%' },
                  { n: 5, p: 'Britannia Marie Gold', insp: 52, viol: 16, r: '30.8%' }
                ].map(r => (
                  <tr key={r.n}>
                    <td>{r.n}</td>
                    <td style={{ fontWeight: 600 }}>{r.p}</td>
                    <td>{r.insp}</td>
                    <td style={{ color: '#ef4444', fontWeight: 600 }}>{r.viol}</td>
                    <td style={{ color: '#ef4444', fontWeight: 700 }}>{r.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Regional Map Stats + Key Insights Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '1.25rem' }}>
        {/* Violations by State/Region */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Violations by State/Region</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 140, height: 110, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a6ef5', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #bfdbfe' }}>
              🗺️ India Map
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', flex: 1, paddingLeft: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>1. Maharashtra</span><strong style={{ color: '#ef4444' }}>92</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2. Uttar Pradesh</span><strong style={{ color: '#ef4444' }}>68</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>3. Tamil Nadu</span><strong style={{ color: '#ef4444' }}>54</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>4. Karnataka</span><strong style={{ color: '#ef4444' }}>42</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>5. Gujarat</span><strong style={{ color: '#ef4444' }}>38</strong></div>
            </div>
          </div>
        </div>

        {/* Key Insights & Recommendation Callout */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lightbulb size={16} color="#d97706" /> Key Insights
            </h3>
            <ul style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, paddingLeft: '1.2rem' }}>
              <li>Consumer care information is the most common violation (32%).</li>
              <li>Compliance rate has improved by 8% compared to last month.</li>
              <li>Food & Beverages category accounts for 43% of all inspections.</li>
              <li>Maharashtra reports the highest number of violations.</li>
            </ul>
          </div>

          <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '0.65rem 0.85rem', marginTop: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#9b2c2c', fontWeight: 700 }}>Recommendation</p>
            <p style={{ fontSize: '0.72rem', color: '#742a2a' }}>
              Increase awareness and enforcement for consumer care declarations in Food & Beverages category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
