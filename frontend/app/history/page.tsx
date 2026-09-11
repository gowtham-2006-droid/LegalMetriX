'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Plus,
  Calendar,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  MoreVertical,
  Share2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function InspectionHistoryPage() {
  const [selectedInspection, setSelectedInspection] = useState<any>({
    id: 'INS-2025-0012',
    name: 'Parle-G Biscuits',
    category: 'Food & Beverages',
    date: '11 Sep 2025, 10:24 AM',
    score: 92,
    status: 'Compliant',
    inspector: 'Inspector-01 (R. Kumar)',
    location: 'Vile Parle, Mumbai',
    findings: [
      { label: 'MRP Declaration', val: 'Detected (₹50/-)', pass: true },
      { label: 'Net Quantity', val: 'Detected (800 g)', pass: true },
      { label: 'Manufacturer Details', val: 'Detected', pass: true },
      { label: 'Consumer Care Information', val: 'Not detected', pass: false },
      { label: 'Date of Manufacture', val: 'Detected (08/2026)', pass: true }
    ]
  });

  const [dateRange, setDateRange] = useState('01 Sep 2025 - 11 Sep 2025');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const historyItems = [
    { id: 'INS-2025-0012', num: 1, name: 'Parle-G Biscuits', cat: 'Food & Beverages', date: '11 Sep 2025 10:24 AM', score: 92, status: 'Compliant', inspector: 'Inspector-01', bg: '#fef08a' },
    { id: 'INS-2025-0011', num: 2, name: 'India Gate Rice', cat: 'Staples', date: '10 Sep 2025 04:15 PM', score: 68, status: 'Needs Review', inspector: 'Inspector-02', bg: '#dcfce7' },
    { id: 'INS-2025-0010', num: 3, name: 'Fortune Sunflower Oil', cat: 'Edible Oil', date: '09 Sep 2025 11:32 AM', score: 45, status: 'Non-Compliant', inspector: 'Inspector-01', bg: '#fef3c7' },
    { id: 'INS-2025-0009', num: 4, name: 'Aashirvaad Atta', cat: 'Staples', date: '08 Sep 2025 02:40 PM', score: 78, status: 'Needs Review', inspector: 'Inspector-03', bg: '#fee2e2' },
    { id: 'INS-2025-0008', num: 5, name: 'Amul Toned Milk', cat: 'Dairy Products', date: '07 Sep 2025 10:10 AM', score: 96, status: 'Compliant', inspector: 'Inspector-01', bg: '#e0f2fe' },
    { id: 'INS-2025-0007', num: 6, name: 'Maggi Noodles', cat: 'Food & Beverages', date: '06 Sep 2025 03:20 PM', score: 62, status: 'Needs Review', inspector: 'Inspector-02', bg: '#fef9c3' },
    { id: 'INS-2025-0006', num: 7, name: 'Tata Salt', cat: 'Staples', date: '05 Sep 2025 12:05 PM', score: 88, status: 'Compliant', inspector: 'Inspector-01', bg: '#f1f5f9' },
    { id: 'INS-2025-0005', num: 8, name: 'Britannia Marie Gold', cat: 'Food & Beverages', date: '04 Sep 2025 09:18 AM', score: 53, status: 'Non-Compliant', inspector: 'Inspector-03', bg: '#ffedd5' },
    { id: 'INS-2025-0004', num: 9, name: 'Surf Excel', cat: 'Home Care', date: '03 Sep 2025 05:45 PM', score: 76, status: 'Needs Review', inspector: 'Inspector-02', bg: '#ede9fe' },
    { id: 'INS-2025-0003', num: 10, name: 'Dove Bathing Soap', cat: 'Personal Care', date: '02 Sep 2025 01:12 PM', score: 90, status: 'Compliant', inspector: 'Inspector-01', bg: '#fce7f3' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
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
            <History size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Inspection History
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              View and manage all your previous inspections. Click on any record to see complete details.
            </p>
          </div>
        </div>

        <Link href="/inspections/new" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={16} />
          New Inspection
        </Link>
      </div>

      {/* Filter Bar matching Image 9 */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Date Range */}
          <div style={{ position: 'relative', minWidth: 200 }}>
            <Calendar size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.1rem', fontSize: '0.8rem' }}
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field"
            style={{ minWidth: 150, fontSize: '0.8rem' }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Staples">Staples</option>
            <option value="Edible Oil">Edible Oil</option>
            <option value="Dairy Products">Dairy Products</option>
            <option value="Home Care">Home Care</option>
            <option value="Personal Care">Personal Care</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field"
            style={{ minWidth: 140, fontSize: '0.8rem' }}
          >
            <option value="All Status">All Status</option>
            <option value="Compliant">Compliant</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>

          {/* Score Range */}
          <select className="select-field" style={{ minWidth: 130, fontSize: '0.8rem' }}>
            <option>All Scores</option>
            <option>90% - 100%</option>
            <option>70% - 89%</option>
            <option>Below 70%</option>
          </select>

          {/* Inspector */}
          <select className="select-field" style={{ minWidth: 140, fontSize: '0.8rem' }}>
            <option>All Inspectors</option>
            <option>Inspector-01</option>
            <option>Inspector-02</option>
            <option>Inspector-03</option>
          </select>

          {/* Buttons */}
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            Apply Filters
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Pills matching Image 9 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Inspections</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>128</p>
          </div>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Compliant</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>91</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>71%</span>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Needs Review</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>25</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>20%</span>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Non-Compliant</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>12</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>9%</span>
        </div>
      </div>

      {/* Main Split: Table (65%) + Right Details Drawer (35%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '1.25rem',
        alignItems: 'flex-start'
      }}>
        {/* Left: Paginated Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th style={{ width: 30 }}><input type="checkbox" /></th>
                  <th style={{ width: 30 }}>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Inspector</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((item) => {
                  const isSelected = selectedInspection?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedInspection({
                        id: item.id,
                        name: item.name,
                        category: item.cat,
                        date: item.date,
                        score: item.score,
                        status: item.status,
                        inspector: `${item.inspector} (R. Kumar)`,
                        location: 'Vile Parle, Mumbai',
                        findings: [
                          { label: 'MRP Declaration', val: 'Detected (₹50/-)', pass: true },
                          { label: 'Net Quantity', val: 'Detected', pass: true },
                          { label: 'Manufacturer Details', val: 'Detected', pass: true },
                          { label: 'Consumer Care Information', val: item.status === 'Compliant' ? 'Detected' : 'Not detected', pass: item.status === 'Compliant' },
                          { label: 'Date of Manufacture', val: 'Detected (08/2026)', pass: true }
                        ]
                      })}
                      style={{
                        cursor: 'pointer',
                        background: isSelected ? '#eff6ff' : 'transparent'
                      }}
                    >
                      <td><input type="checkbox" checked={isSelected} onChange={() => {}} /></td>
                      <td style={{ color: '#94a3b8' }}>{item.num}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 4, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                            📦
                          </div>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748b' }}>{item.cat}</td>
                      <td style={{ color: '#64748b' }}>{item.date}</td>
                      <td>
                        <span style={{
                          padding: '0.15rem 0.45rem',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: item.score >= 80 ? '#ecfdf5' : (item.score >= 60 ? '#fffbeb' : '#fef2f2'),
                          color: item.score >= 80 ? '#059669' : (item.score >= 60 ? '#d97706' : '#dc2626')
                        }}>
                          {item.score}%
                        </span>
                      </td>
                      <td>
                        {item.status === 'Compliant' && <span className="badge badge-compliant">Compliant</span>}
                        {item.status === 'Needs Review' && <span className="badge badge-review">Needs Review</span>}
                        {item.status === 'Non-Compliant' && <span className="badge badge-noncompliant">Non-Compliant</span>}
                      </td>
                      <td style={{ color: '#64748b' }}>{item.inspector}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Link
                            href={`/inspections/${item.id}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          >
                            <Eye size={12} /> View
                          </Link>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.78rem',
            color: '#64748b'
          }}>
            <span>Showing 1 to 10 of 128 inspections</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><ChevronLeft size={14} /></button>
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>1</button>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>2</button>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>3</button>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>4</button>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>5</button>
              <span>...</span>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', minWidth: 26 }}>13</button>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><ChevronRight size={14} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Rows per page:</span>
              <select className="select-field" style={{ padding: '0.2rem 0.4rem', width: 60, fontSize: '0.78rem' }}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Inspection Details Drawer matching Image 9 */}
        {selectedInspection && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Inspection Details</h3>
              <Link
                href={`/inspections/${selectedInspection.id}`}
                className="btn btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                View Full Report
              </Link>
            </div>

            {/* Product Header Card */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 70, height: 60, background: '#fef08a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#854d0e', border: '1px solid #ca8a04' }}>
                Parle-G
              </div>
              <div style={{ fontSize: '0.78rem' }}>
                <p style={{ color: '#64748b' }}>Inspection ID: <strong style={{ color: '#0f172a' }}>{selectedInspection.id}</strong></p>
                <p style={{ color: '#64748b' }}>Date & Time: {selectedInspection.date}</p>
                <p style={{ color: '#64748b' }}>Inspector: {selectedInspection.inspector}</p>
              </div>
            </div>

            {/* Spec breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Location</span>
                <span style={{ fontWeight: 600 }}>{selectedInspection.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Product</span>
                <span style={{ fontWeight: 600 }}>{selectedInspection.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600 }}>{selectedInspection.category}</span>
              </div>
            </div>

            {/* Compliance Score Block */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Compliance Score</span>
                <span className="badge badge-compliant" style={{ fontSize: '0.72rem' }}>
                  {selectedInspection.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: 60, height: 60 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray={`${selectedInspection.score} 100`} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800 }}>
                    {selectedInspection.score}%
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                  All mandatory declarations found. Product is compliant with applicable Legal Metrology rules.
                </p>
              </div>
            </div>

            {/* Key Findings List */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.45rem' }}>Key Findings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                {selectedInspection.findings.map((f: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {f.pass ? <CheckCircle2 size={13} color="#10b981" /> : <AlertTriangle size={13} color="#f59e0b" />}
                      <span style={{ color: '#334155' }}>{f.label}</span>
                    </div>
                    <span style={{ color: f.pass ? '#64748b' : '#ef4444', fontWeight: f.pass ? 400 : 600 }}>
                      {f.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link
                href={`/reports`}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
              >
                View Complete Report
              </Link>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.5rem' }}
              >
                <Share2 size={13} />
                Share Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
