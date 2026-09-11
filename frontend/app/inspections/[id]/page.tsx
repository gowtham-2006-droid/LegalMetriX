'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Check,
  ZoomIn,
  Image as ImageIcon,
  Scan,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function InspectionResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'INS-2025-0012';

  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [imageTab, setImageTab] = useState<'original' | 'processed' | 'ocr'>('processed');
  const [verified, setVerified] = useState(false);

  const checks = [
    {
      num: 1,
      name: 'MRP Declaration',
      status: 'Pass',
      statusType: 'pass',
      value: '₹50/-',
      conf: '99%',
      rule: 'LM (PC) Rules, 2011 Rule 6',
      hasEvidence: true,
      remarks: 'Detected clearly',
      link: `/inspections/${id}/evidence`
    },
    {
      num: 2,
      name: 'Net Quantity',
      status: 'Pass',
      statusType: 'pass',
      value: '800 g',
      conf: '97%',
      rule: 'Rule 6 & 18',
      hasEvidence: true,
      remarks: 'Detected clearly',
      link: `/inspections/${id}/evidence`
    },
    {
      num: 3,
      name: 'Manufacturer Details',
      status: 'Pass',
      statusType: 'pass',
      value: 'Parle Products Pvt. Ltd. Vile Parle, Mumbai - 400057',
      conf: '94%',
      rule: 'Rule 6(1)(d)',
      hasEvidence: true,
      remarks: 'Detected clearly',
      link: `/inspections/${id}/evidence`
    },
    {
      num: 4,
      name: 'Consumer Care Information',
      status: 'Issue',
      statusType: 'issue',
      value: 'Not detected',
      conf: '—',
      rule: 'Rule 6(1)(f)',
      hasEvidence: true,
      remarks: 'Mandatory declaration missing',
      link: `/inspections/${id}/violation`
    },
    {
      num: 5,
      name: 'Date of Manufacture',
      status: 'Pass',
      statusType: 'pass',
      value: '08/2026',
      conf: '91%',
      rule: 'Rule 6(1)(e)',
      hasEvidence: true,
      remarks: 'Detected clearly',
      link: `/inspections/${id}/evidence`
    },
    {
      num: 6,
      name: 'Best Before / Expiry',
      status: 'Warning',
      statusType: 'warning',
      value: 'Not detected',
      conf: '—',
      rule: 'Rule 6(1)(e)',
      hasEvidence: false,
      remarks: 'May be required for this category',
      link: '#'
    },
    {
      num: 7,
      name: 'Country of Origin',
      status: 'Warning',
      statusType: 'warning',
      value: 'Not detected',
      conf: '—',
      rule: 'Rule 6(1)(h)',
      hasEvidence: false,
      remarks: 'Required for imported goods',
      link: '#'
    },
    {
      num: 8,
      name: 'Unit of Quantity',
      status: 'Pass',
      statusType: 'pass',
      value: 'g (grams)',
      conf: '96%',
      rule: 'Rule 6(3)',
      hasEvidence: true,
      remarks: 'Compliant',
      link: `/inspections/${id}/evidence`
    }
  ];

  const filteredChecks = showOnlyIssues
    ? checks.filter((c) => c.statusType !== 'pass')
    : checks;

  return (
    <div>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: '#64748b',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Bar */}
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
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Inspection Result
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              AI analysis completed. Review the compliance status and details below.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
              Inspection ID: {id}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              11 Sep 2025, 10:24 AM
            </p>
          </div>
          <Link
            href={`/reports`}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
          >
            <Download size={15} />
            Download Report
          </Link>
        </div>
      </div>

      {/* 5-Stage Step Indicator */}
      <div className="card" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { num: 1, label: 'Image Upload', done: true },
            { num: 2, label: 'Text Extraction', done: true },
            { num: 3, label: 'Information Extraction', done: true },
            { num: 4, label: 'Rule Analysis', done: true },
            { num: 5, label: 'Results', active: true },
          ].map((s, idx) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {s.done ? (
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} />
                </div>
              ) : (
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a6ef5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                  {s.num}
                </div>
              )}
              <span style={{ fontSize: '0.82rem', fontWeight: s.active ? 700 : 500, color: s.active ? '#1a6ef5' : (s.done ? '#1e293b' : '#94a3b8') }}>
                {s.num}. {s.label}
              </span>
              {idx < 4 && (
                <div style={{ width: 40, height: 1, background: '#e2e8f0', marginLeft: '0.5rem' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top 3-Column Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr 1fr',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        {/* Col 1: Product Image (Analyzed) with Interactive Bounding Boxes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Product Image (Analyzed)
            </h3>

            {/* Interactive Package Canvas */}
            <div style={{
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Parle-G Biscuit Packet with Bounding Boxes */}
              <div style={{
                position: 'relative',
                width: 320,
                height: 190,
                background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
                border: '1px solid #ca8a04',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '0.75rem'
              }}>
                {/* BBox 1: Mfd Date (Purple) */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  border: '2px solid #a855f7',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 4,
                  background: 'rgba(168, 85, 247, 0.1)'
                }}>
                  <span style={{ fontSize: '0.62rem', background: '#9333ea', color: 'white', padding: '0.1rem 0.3rem', borderRadius: 2 }}>
                    Mfd. 08/2026
                  </span>
                </div>

                {/* BBox 2: MRP (Blue) */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 15,
                  border: '2px solid #0284c7',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 4,
                  background: 'rgba(2, 132, 199, 0.1)'
                }}>
                  <span style={{ fontSize: '0.62rem', background: '#0284c7', color: 'white', padding: '0.1rem 0.3rem', borderRadius: 2 }}>
                    MRP ₹50/-
                  </span>
                </div>

                {/* BBox 3: Brand (Red) */}
                <div style={{
                  position: 'absolute',
                  top: 35,
                  left: 110,
                  border: '1.5px solid #ef4444',
                  padding: '0.1rem 0.3rem',
                  borderRadius: 4
                }}>
                  <span style={{ fontSize: '0.55rem', background: '#ef4444', color: 'white', padding: '0.05rem 0.25rem', borderRadius: 2 }}>
                    Brand
                  </span>
                </div>

                {/* BBox 4: Product Name (Green) */}
                <div style={{
                  position: 'absolute',
                  top: 60,
                  left: 80,
                  border: '2.5px solid #16a34a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 6,
                  background: 'rgba(22, 163, 74, 0.1)'
                }}>
                  <div style={{ background: '#b91c1c', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 900, fontSize: '0.95rem' }}>
                    Parle-G
                  </div>
                  <span style={{ position: 'absolute', top: -14, left: 4, fontSize: '0.55rem', background: '#16a34a', color: 'white', padding: '0.05rem 0.25rem', borderRadius: 2 }}>
                    Product Name
                  </span>
                </div>

                {/* BBox 5: Net Quantity (Orange) */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 10,
                  border: '2px solid #f97316',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 4,
                  background: 'rgba(249, 115, 22, 0.1)'
                }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c2d12' }}>Net Wt. 800 g</p>
                  <span style={{ position: 'absolute', bottom: -12, left: 0, fontSize: '0.55rem', background: '#f97316', color: 'white', padding: '0.05rem 0.25rem', borderRadius: 2 }}>
                    Net Quantity
                  </span>
                </div>

                {/* BBox 6: Manufacturer (Cyan) */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 120,
                  border: '2px solid #0891b2',
                  padding: '0.15rem 0.35rem',
                  borderRadius: 4,
                  background: 'rgba(8, 145, 178, 0.1)'
                }}>
                  <p style={{ fontSize: '0.55rem', color: '#155e75', lineHeight: 1.1 }}>
                    Parle Products Pvt. Ltd.<br />Vile Parle, Mumbai - 400057
                  </p>
                  <span style={{ position: 'absolute', bottom: -12, left: 0, fontSize: '0.52rem', background: '#0891b2', color: 'white', padding: '0.05rem 0.25rem', borderRadius: 2 }}>
                    Manufacturer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle buttons underneath image */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button
              onClick={() => setImageTab('original')}
              style={{
                flex: 1,
                padding: '0.35rem',
                fontSize: '0.75rem',
                borderRadius: 6,
                border: imageTab === 'original' ? '1px solid #1a6ef5' : '1px solid #e2e8f0',
                background: imageTab === 'original' ? '#eff6ff' : '#ffffff',
                color: imageTab === 'original' ? '#1a6ef5' : '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Original Image
            </button>
            <button
              onClick={() => setImageTab('processed')}
              style={{
                flex: 1,
                padding: '0.35rem',
                fontSize: '0.75rem',
                borderRadius: 6,
                border: imageTab === 'processed' ? '1px solid #1a6ef5' : '1px solid #e2e8f0',
                background: imageTab === 'processed' ? '#eff6ff' : '#ffffff',
                color: imageTab === 'processed' ? '#1a6ef5' : '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Processed Image
            </button>
            <button
              onClick={() => setImageTab('ocr')}
              style={{
                flex: 1,
                padding: '0.35rem',
                fontSize: '0.75rem',
                borderRadius: 6,
                border: imageTab === 'ocr' ? '1px solid #1a6ef5' : '1px solid #e2e8f0',
                background: imageTab === 'ocr' ? '#eff6ff' : '#ffffff',
                color: imageTab === 'ocr' ? '#1a6ef5' : '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              OCR View
            </button>
            <Link
              href={`/inspections/${id}/evidence`}
              style={{
                padding: '0.35rem 0.55rem',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                background: '#ffffff',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Full Screen Evidence"
            >
              <ZoomIn size={14} />
            </Link>
          </div>
        </div>

        {/* Col 2: Compliance Score & Extracted Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Compliance Score
            </h3>

            {/* Circular Gauge & Status Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="82 100" />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0f172a'
                }}>
                  82%
                </div>
              </div>

              {/* Warning Banner */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 8,
                padding: '0.6rem 0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d97706', fontWeight: 700, fontSize: '0.82rem' }}>
                  <AlertTriangle size={15} />
                  Potentially Non-Compliant
                </div>
                <p style={{ fontSize: '0.72rem', color: '#92400e', marginTop: 2, lineHeight: 1.3 }}>
                  Some mandatory declarations are missing or could not be detected. Manual review is recommended.
                </p>
              </div>
            </div>

            {/* Spec List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Product</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Parle-G Biscuits</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Food & Beverages</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Brand</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Parle</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Net Quantity (Declared)</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>800 g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>MRP (Declared)</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>₹50/-</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Manufacturer</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Parle Products Pvt. Ltd.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date of Manufacture</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>08/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Inspection Summary, Key Issues & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Card: Summary Stats */}
          <div className="card" style={{ padding: '0.85rem 1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              Inspection Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', textAlign: 'center', gap: '0.35rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Total</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>8</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#059669' }}>Passed</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>5</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#dc2626' }}>Failed</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>1</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#d97706' }}>Warnings</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>2</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#2563eb' }}>Review</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a6ef5' }}>2</p>
              </div>
            </div>
          </div>

          {/* Card: Key Issues Alert */}
          <div style={{
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: 10,
            padding: '0.85rem 1rem',
            fontSize: '0.78rem'
          }}>
            <p style={{ fontWeight: 700, color: '#9b2c2c', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} /> Key Issues
            </p>
            <p style={{ color: '#c53030', fontWeight: 600 }}>• 1 Critical Issue</p>
            <p style={{ color: '#742a2a', fontSize: '0.72rem', paddingLeft: '0.75rem', marginBottom: '0.4rem' }}>
              Consumer Care Information not detected (Required under Rule 6(1)(f))
            </p>
            <p style={{ color: '#dd6b20', fontWeight: 600 }}>• 2 Warnings</p>
            <p style={{ color: '#7b341e', fontSize: '0.72rem', paddingLeft: '0.75rem' }}>
              Best Before / Expiry date not detected · Country of Origin not detected
            </p>
          </div>

          {/* Actions */}
          <div className="card" style={{ padding: '0.85rem 1rem' }}>
            <Link
              href={`/reports`}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem', marginBottom: '0.5rem' }}
            >
              <FileText size={15} />
              Generate Inspection Report
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => setVerified(!verified)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.45rem', color: verified ? '#10b981' : '#334155' }}
              >
                <Check size={14} />
                {verified ? 'Verified' : 'Mark as Verified'}
              </button>
              <Link
                href={`/inspections/${id}/analyzing`}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.45rem' }}
              >
                <RefreshCw size={14} />
                Re-analyze Image
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Compliance Check Results Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Compliance Check Results</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showOnlyIssues}
              onChange={(e) => setShowOnlyIssues(e.target.checked)}
              style={{ accentColor: '#1a6ef5' }}
            />
            Show Only Issues
          </label>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Requirement</th>
                <th>Status</th>
                <th>Extracted Value</th>
                <th>Confidence</th>
                <th>Rule Reference</th>
                <th>Evidence</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecks.map((row) => (
                <tr key={row.num}>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{row.num}</td>
                  <td style={{ fontWeight: 600 }}>{row.name}</td>
                  <td>
                    {row.statusType === 'pass' && (
                      <span className="badge badge-compliant">
                        <Check size={12} /> Pass
                      </span>
                    )}
                    {row.statusType === 'issue' && (
                      <span className="badge badge-noncompliant">
                        <XCircle size={12} /> Issue
                      </span>
                    )}
                    {row.statusType === 'warning' && (
                      <span className="badge badge-review">
                        <AlertTriangle size={12} /> Warning
                      </span>
                    )}
                  </td>
                  <td style={{ fontWeight: row.value === 'Not detected' ? 400 : 600, color: row.value === 'Not detected' ? '#ef4444' : '#1e293b' }}>
                    {row.value}
                  </td>
                  <td style={{ color: row.conf !== '—' ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                    {row.conf}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {row.rule}
                  </td>
                  <td>
                    {row.hasEvidence ? (
                      <Link
                        href={row.link}
                        className="btn btn-secondary"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                      >
                        <Eye size={12} /> View
                      </Link>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: row.statusType === 'issue' ? '#ef4444' : '#64748b' }}>
                    {row.remarks}
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
