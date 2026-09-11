'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { LegalMetrixLogo, IndiaEmblem } from '@/components/Logo';

export default function InspectionReportPage() {
  const handleDownloadPdf = () => {
    window.open('/api/inspection/INS-2025-0012/report', '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          href="/inspections/INS-2025-0012"
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
          Back to Results
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
          >
            <Eye size={15} />
            Preview PDF
          </button>
          <button
            onClick={handleDownloadPdf}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
          >
            <Download size={15} />
            Download Inspection Report (PDF)
          </button>
        </div>
      </div>

      {/* Official Government Inspection Document Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: 12,
        padding: '2.5rem 3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        color: '#0f172a'
      }}>
        {/* Document Header with Dual Logos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0284c7', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LegalMetrixLogo size={42} />
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Legal<span style={{ color: '#0284c7' }}>MetriX</span>
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                AI-Powered Compliance Inspection System
              </p>
            </div>
          </div>

          <IndiaEmblem height={42} invert={false} />
        </div>

        {/* Title & Metadata Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Inspection Report
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
              Packaging Compliance Analysis under Legal Metrology (Packaged Commodities) Rules
            </p>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Inspection ID:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>INS-2025-0012</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Date & Time:</span>
              <span>11 Sep 2025, 10:24 AM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Inspector:</span>
              <span>Inspector-01 (R. Kumar)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Location:</span>
              <span>Vile Parle, Mumbai, Maharashtra</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Inspection Type:</span>
              <span>Retail Shop Inspection</span>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Product Image & Product Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* 1. Product Image */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
              1. Product Image
            </h3>
            <div style={{
              height: 175,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ background: '#b91c1c', color: 'white', padding: '0.4rem 1.1rem', borderRadius: 6, fontWeight: 900, fontSize: '1.1rem' }}>
                Parle-G
              </div>
              <p style={{ fontSize: '0.72rem', color: '#713f12', marginTop: 2 }}>Original Gluco Biscuits</p>
              <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: '0.68rem', color: '#854d0e' }}>
                Net Wt. 800 g
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
              <span>File: product_front.jpg</span>
              <span>Captured on: 11 Sep 2025, 10:22 AM</span>
            </div>
          </div>

          {/* 2. Product Details */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
              2. Product Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Product Name</span>
                <span style={{ fontWeight: 600 }}>Parle-G Biscuits</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600 }}>Food & Beverages</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Brand</span>
                <span style={{ fontWeight: 600 }}>Parle</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Net Quantity (Declared)</span>
                <span style={{ fontWeight: 600 }}>800 g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>MRP (Declared)</span>
                <span style={{ fontWeight: 600 }}>₹50/-</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Manufacturer</span>
                <span style={{ fontWeight: 600 }}>Parle Products Pvt. Ltd.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Date of Manufacture</span>
                <span style={{ fontWeight: 600 }}>08/2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Best Before / Expiry</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Not detected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Country of Origin</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Not detected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Compliance Summary & Extracted Declarations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* 3. Compliance Summary */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              3. Compliance Summary
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
              <div style={{ position: 'relative', width: 70, height: 70 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="82 100" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>
                  82%
                </div>
              </div>
              <div>
                <span className="badge badge-review" style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}>
                  ⚠️ Potentially Non-Compliant
                </span>
                <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                  Some mandatory declarations are missing or could not be detected. Manual review is recommended.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', fontSize: '0.72rem' }}>
              <div><strong style={{ color: '#10b981' }}>5</strong><br /><span style={{ color: '#64748b' }}>Passed</span></div>
              <div><strong style={{ color: '#ef4444' }}>1</strong><br /><span style={{ color: '#64748b' }}>Failed</span></div>
              <div><strong style={{ color: '#f59e0b' }}>2</strong><br /><span style={{ color: '#64748b' }}>Warnings</span></div>
              <div><strong style={{ color: '#1a6ef5' }}>2</strong><br /><span style={{ color: '#64748b' }}>Manual Review</span></div>
            </div>
          </div>

          {/* 4. Extracted Declarations (AI) */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              4. Extracted Declarations (AI)
            </h3>
            <table style={{ width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ paddingBottom: 4 }}>Field</th>
                  <th style={{ paddingBottom: 4 }}>Extracted Value</th>
                  <th style={{ paddingBottom: 4, textAlign: 'right' }}>Confidence</th>
                </tr>
              </thead>
              <tbody style={{ lineHeight: 1.8 }}>
                <tr><td>Product</td><td>Parle-G Biscuits</td><td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>98%</td></tr>
                <tr><td>MRP</td><td>₹50/-</td><td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>99%</td></tr>
                <tr><td>Net Quantity</td><td>800 g</td><td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>97%</td></tr>
                <tr><td>Manufacturer</td><td>Parle Products Pvt. Ltd.</td><td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>94%</td></tr>
                <tr><td>Consumer Care</td><td style={{ color: '#ef4444' }}>Not detected</td><td style={{ textAlign: 'right' }}>—</td></tr>
                <tr><td>Date of Manufacture</td><td>08/2026</td><td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>91%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Compliance Check Results */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            5. Compliance Check Results
          </h3>
          <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table className="data-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ width: 30 }}>#</th>
                  <th>Requirement</th>
                  <th>Status</th>
                  <th>Extracted Value</th>
                  <th>Confidence</th>
                  <th>Rule Reference</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, req: 'MRP Declaration', st: 'Pass', val: '₹50/-', conf: '99%', ref: 'LM (PC) Rules, 2011 Rule 6', rem: 'Detected clearly' },
                  { n: 2, req: 'Net Quantity', st: 'Pass', val: '800 g', conf: '97%', ref: 'Rule 6 & 18', rem: 'Detected clearly' },
                  { n: 3, req: 'Manufacturer Details', st: 'Pass', val: 'Parle Products Pvt. Ltd.', conf: '94%', ref: 'Rule 6(1)(d)', rem: 'Detected clearly' },
                  { n: 4, req: 'Consumer Care Information', st: 'Fail', val: 'Not detected', conf: '—', ref: 'Rule 6(1)(f)', rem: 'Mandatory declaration missing' },
                  { n: 5, req: 'Date of Manufacture', st: 'Pass', val: '08/2026', conf: '91%', ref: 'Rule 6(1)(e)', rem: 'Detected clearly' },
                  { n: 6, req: 'Best Before / Expiry', st: 'Warning', val: 'Not detected', conf: '—', ref: 'Rule 6(1)(e)', rem: 'May be required for this category' },
                  { n: 7, req: 'Country of Origin', st: 'Warning', val: 'Not detected', conf: '—', ref: 'Rule 6(1)(h)', rem: 'Required for imported goods' },
                  { n: 8, req: 'Unit of Quantity', st: 'Pass', val: 'g (grams)', conf: '96%', ref: 'Rule 6(3)', rem: 'Compliant' }
                ].map((r) => (
                  <tr key={r.n}>
                    <td>{r.n}</td>
                    <td style={{ fontWeight: 600 }}>{r.req}</td>
                    <td>
                      {r.st === 'Pass' && <span className="badge badge-compliant"><CheckCircle2 size={11} /> Pass</span>}
                      {r.st === 'Fail' && <span className="badge badge-noncompliant"><XCircle size={11} /> Fail</span>}
                      {r.st === 'Warning' && <span className="badge badge-review"><AlertTriangle size={11} /> Warning</span>}
                    </td>
                    <td style={{ color: r.val === 'Not detected' ? '#ef4444' : '#0f172a', fontWeight: 500 }}>{r.val}</td>
                    <td style={{ color: r.conf !== '—' ? '#059669' : '#94a3b8', fontWeight: 600 }}>{r.conf}</td>
                    <td style={{ color: '#64748b' }}>{r.ref}</td>
                    <td style={{ color: r.st === 'Fail' ? '#ef4444' : '#64748b' }}>{r.rem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6 & 7: Visual Evidence & Rules Applied */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* 6. Visual Evidence */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              6. Visual Evidence
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.4rem', textAlign: 'center' }}>
                <div style={{ height: 65, background: '#fef08a', borderRadius: 4, marginBottom: 4 }} />
                <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600 }}>Full Image (Detected Elements)</span>
              </div>
              <div style={{ border: '1px solid #fecaca', borderRadius: 6, padding: '0.4rem', textAlign: 'center', background: '#fff5f5' }}>
                <div style={{ height: 65, border: '1.5px dashed #dc2626', borderRadius: 4, marginBottom: 4 }} />
                <span style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 700 }}>Consumer Care (Not Detected)</span>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.4rem', textAlign: 'center' }}>
                <div style={{ height: 65, background: '#e0f2fe', borderRadius: 4, marginBottom: 4 }} />
                <span style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Manufacturer (Detected)</span>
              </div>
            </div>
          </div>

          {/* 7. Rules Applied */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              7. Rules Applied
            </h3>
            <ul style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.6, paddingLeft: '1.1rem' }}>
              <li>Legal Metrology (Packaged Commodities) Rules, 2011</li>
              <li>Rule 6 — Mandatory Declarations</li>
              <li>Rule 18 — Net Quantity Standards</li>
              <li>Rule 6(1)(d) — Name and Address of Manufacturer</li>
              <li>Rule 6(1)(f) — Consumer Care Details</li>
              <li>Rule 6(1)(e) — Date of Manufacture / Best Before</li>
              <li>Rule 6(1)(h) — Country of Origin (for imported goods)</li>
              <li>Rule 6(3) — Unit of Quantity Standards</li>
            </ul>
          </div>
        </div>

        {/* Section 8 & 9: Notes & Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              8. Inspector Notes / Manual Verification
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#475569', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0', lineHeight: 1.4 }}>
              Consumer care information not visible on the package. Please verify manually. Best before/expiry date may be printed on another side of the pack.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              9. Signatures
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.5rem' }}>
              <div>
                <p style={{ fontFamily: 'cursive', fontSize: '1.15rem', color: '#1e3a8a', fontStyle: 'italic', marginBottom: 2 }}>
                  R. Kumar
                </p>
                <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  R. Kumar<br />Inspector-01
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b' }}>
                <p style={{ fontWeight: 600, color: '#0f172a' }}>Report Generated By</p>
                <p>LegalMetriX System</p>
                <p>11 Sep 2025, 10:24 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94a3b8' }}>
          <span>Ensuring Fair Trade | Protecting Consumers | Strengthening Compliance</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
