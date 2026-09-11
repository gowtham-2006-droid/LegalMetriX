'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  Camera,
  ArrowUpRight,
  MoreVertical,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function DashboardPage() {
  const recentInspections = [
    {
      id: 'INS-2025-0012',
      name: 'Parle-G Biscuits',
      sub: 'Biscuit',
      category: 'Food',
      categoryColor: '#3b82f6',
      date: '11 Sep 2025, 10:24 AM',
      score: 92,
      status: 'Compliant',
      statusClass: 'badge-compliant',
      thumbnailBg: '#fef08a'
    },
    {
      id: 'INS-2025-0011',
      name: 'Tata Rice',
      sub: 'Rice',
      category: 'Food',
      categoryColor: '#3b82f6',
      date: '10 Sep 2025, 04:17 PM',
      score: 68,
      status: 'Review',
      statusClass: 'badge-review',
      thumbnailBg: '#dcfce7'
    },
    {
      id: 'INS-2025-0010',
      name: 'Fortune Oil',
      sub: 'Cooking Oil',
      category: 'Food',
      categoryColor: '#3b82f6',
      date: '09 Sep 2025, 01:32 PM',
      score: 45,
      status: 'Non-Compliant',
      statusClass: 'badge-noncompliant',
      thumbnailBg: '#fef3c7'
    },
    {
      id: 'INS-2025-0009',
      name: 'Aashirvaad Atta',
      sub: 'Flour',
      category: 'Food',
      categoryColor: '#3b82f6',
      date: '08 Sep 2025, 11:06 AM',
      score: 87,
      status: 'Compliant',
      statusClass: 'badge-compliant',
      thumbnailBg: '#fee2e2'
    },
    {
      id: 'INS-2025-0008',
      name: 'Harpic Cleaner',
      sub: 'Household',
      category: 'Household',
      categoryColor: '#8b5cf6',
      date: '07 Sep 2025, 03:45 PM',
      score: 62,
      status: 'Review',
      statusClass: 'badge-review',
      thumbnailBg: '#e0e7ff'
    },
  ];

  return (
    <div>
      {/* Top Greeting */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a' }}>
          Good Morning, Inspector!
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Here's what's happening with your inspections today.
        </p>
      </div>

      {/* Row 1: 5 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Total Inspections */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '0.75rem' }}>
            <FileText size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Inspections</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>128</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>↑ 12% <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last 7 days</span></span>
        </div>

        {/* Compliant Products */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Compliant Products</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>91</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>↑ 18% <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last 7 days</span></span>
        </div>

        {/* Potential Violations */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Potential Violations</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>37</div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>↑ 8% <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last 7 days</span></span>
        </div>

        {/* Pending Manual Reviews */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '0.75rem' }}>
            <Clock size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Pending Manual Reviews</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>12</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>↓ 25% <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last 7 days</span></span>
        </div>

        {/* Average Compliance Score */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '0.75rem' }}>
            <Star size={20} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Average Compliance Score</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>78%</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>↑ 6% <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs. last 7 days</span></span>
        </div>
      </div>

      {/* Row 2: Compliance Overview Chart (2/3) + Quick Start (1/3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Compliance Overview Line Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Compliance Overview</h3>
            <button style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}>
              Last 7 Days <ChevronDown size={14} />
            </button>
          </div>

          {/* SVG Line Graph */}
          <div style={{ position: 'relative', height: 180, width: '100%' }}>
            <svg viewBox="0 0 600 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="600" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* Left y-axis labels */}
              <text x="-25" y="24" fontSize="10" fill="#94a3b8">100%</text>
              <text x="-20" y="64" fontSize="10" fill="#94a3b8">75%</text>
              <text x="-20" y="104" fontSize="10" fill="#94a3b8">50%</text>
              <text x="-20" y="144" fontSize="10" fill="#94a3b8">0%</text>

              {/* Area path */}
              <path
                d="M 20 85 C 80 88, 120 102, 170 100 C 230 98, 260 62, 310 65 C 360 68, 400 78, 450 60 C 500 55, 540 82, 580 40 L 580 150 L 20 150 Z"
                fill="url(#areaGradient)"
              />

              {/* Spline curve line */}
              <path
                d="M 20 85 C 80 88, 120 102, 170 100 C 230 98, 260 62, 310 65 C 360 68, 400 78, 450 60 C 500 55, 540 82, 580 40"
                fill="none"
                stroke="#1a6ef5"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {[[20, 85], [170, 100], [310, 65], [450, 60], [580, 40]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#1a6ef5" strokeWidth="2.5" />
              ))}

              {/* X-axis date labels */}
              <text x="15" y="158" fontSize="10" fill="#94a3b8">4 Sep</text>
              <text x="100" y="158" fontSize="10" fill="#94a3b8">5 Sep</text>
              <text x="190" y="158" fontSize="10" fill="#94a3b8">6 Sep</text>
              <text x="280" y="158" fontSize="10" fill="#94a3b8">7 Sep</text>
              <text x="370" y="158" fontSize="10" fill="#94a3b8">8 Sep</text>
              <text x="460" y="158" fontSize="10" fill="#94a3b8">9 Sep</text>
              <text x="545" y="158" fontSize="10" fill="#94a3b8">10 Sep</text>
            </svg>
          </div>
        </div>

        {/* Quick Launch Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Link
              href="/inspections/new"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', marginBottom: '0.75rem' }}
            >
              <Camera size={18} />
              New Inspection →
            </Link>
            <p style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', marginBottom: '1.25rem' }}>
              Upload product image or capture using camera
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a6ef5', flexShrink: 0 }}>
                  <FileText size={15} />
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>Supported formats</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a6ef5', flexShrink: 0 }}>
                  <Layers size={15} />
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>Common categories</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Food, Beverages, Household, Personal Care, etc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Inspections Table (2/3) + Donut & Top Violations (1/3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.25rem'
      }}>
        {/* Recent Inspections Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Inspections</h3>
            <Link href="/history" style={{ fontSize: '0.82rem', color: '#1a6ef5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View All →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Compliance Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInspections.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 6,
                          background: item.thumbnailBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: '#475569',
                          border: '1px solid #e2e8f0'
                        }}>
                          📦
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</p>
                          <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.sub}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.date}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', width: 30 }}>{item.score}%</span>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{
                            width: `${item.score}%`,
                            height: '100%',
                            background: item.score >= 80 ? '#10b981' : (item.score >= 60 ? '#f59e0b' : '#ef4444')
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Link
                          href={`/inspections/${item.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          View
                        </Link>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Donut & Top Violations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Compliance Status Donut */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Compliance Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Circular SVG Donut */}
              <div style={{ position: 'relative', width: 110, height: 110 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Compliant green arc: 71% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="71 100" />
                  {/* Review orange arc: 9% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="9 100" strokeDashoffset="-71" />
                  {/* Non-compliant red arc: 20% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-80" />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>128</span>
                  <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Total Inspections</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ color: '#475569', minWidth: 80 }}>Compliant</span>
                  <span style={{ fontWeight: 700 }}>91</span>
                  <span style={{ color: '#94a3b8' }}>71%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ color: '#475569', minWidth: 80 }}>Needs Review</span>
                  <span style={{ fontWeight: 700 }}>12</span>
                  <span style={{ color: '#94a3b8' }}>9%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ color: '#475569', minWidth: 80 }}>Non-Compliant</span>
                  <span style={{ fontWeight: 700 }}>25</span>
                  <span style={{ color: '#94a3b8' }}>20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Violations Bars */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Top Violations</h3>
              <Link href="/analytics" style={{ fontSize: '0.75rem', color: '#1a6ef5', fontWeight: 600 }}>View All →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Consumer Care Information', pct: 32, color: '#ef4444' },
                { name: 'MRP Declaration', pct: 21, color: '#f97316' },
                { name: 'Net Quantity', pct: 15, color: '#f59e0b' },
                { name: 'Manufacturer Details', pct: 11, color: '#8b5cf6' },
                { name: 'Other', pct: 21, color: '#94a3b8' },
              ].map((v, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#334155', fontWeight: 500 }}>{v.name}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{v.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${v.pct * 2}%`, height: '100%', background: v.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
