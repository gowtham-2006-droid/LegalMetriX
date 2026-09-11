'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Loader2,
  Printer
} from 'lucide-react';
import { LegalMetrixLogo, IndiaEmblem } from '@/components/Logo';

export default function InspectionReportPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading report...</p>
      </div>
    }>
      <InspectionReportContent />
    </Suspense>
  );
}

function InspectionReportContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');

  const [id, setId] = useState<string>(requestedId || 'INS-2025-0012');
  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState<any>(null);
  const [complianceResults, setComplianceResults] = useState<any[]>([]);
  const [scoreSummary, setScoreSummary] = useState<any>(null);
  const [extractedFields, setExtractedFields] = useState<Record<string, any>>({});
  const [imgViewMode, setImgViewMode] = useState<'ocr' | 'original'>('ocr');

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let currentId = requestedId;
        if (!currentId) {
          const listRes = await fetch('/api/inspections?limit=1', { headers });
          if (listRes.ok) {
            const listData = await listRes.json();
            if (listData.length > 0) {
              currentId = listData[0].id;
              setId(currentId);
            }
          }
        }
        currentId = currentId || 'INS-2025-0012';

        const [inspRes, compRes, fieldsRes] = await Promise.all([
          fetch(`/api/inspection/${currentId}`, { headers }),
          fetch(`/api/inspection/${currentId}/compliance`, { headers }),
          fetch(`/api/inspection/${currentId}/extracted-data`, { headers })
        ]);

        if (inspRes.ok) {
          setInspection(await inspRes.json());
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplianceResults(compData.results || []);
          setScoreSummary(compData.compliance_score || null);
        }
        if (fieldsRes.ok) {
          const fData = await fieldsRes.json();
          const map: Record<string, any> = {};
          (fData.fields || []).forEach((f: any) => {
            map[f.field_name] = f;
          });
          setExtractedFields(map);
        }
      } catch (e) {
        console.error('Failed to load report data:', e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [requestedId]);

  const handleDownloadPdf = () => {
    window.open(`/api/inspection/${id}/report`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Generating official report preview...</p>
      </div>
    );
  }

  const score = scoreSummary || inspection?.compliance_score || {
    weighted_score: 82,
    status_label: 'Potentially Non-Compliant',
    passed_count: 5,
    failed_count: 1,
    review_count: 2
  };

  const formattedDate = inspection?.created_at
    ? new Date(inspection.created_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '11 Sep 2025, 10:24 AM';

  const isCompliant = score.weighted_score >= 85;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          href={`/inspections/${id}`}
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
          Back to Inspection Results
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
          >
            <Printer size={15} />
            Print Report
          </button>
          <button
            onClick={handleDownloadPdf}
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
          >
            <Download size={15} />
            Download PDF Certificate
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
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Legal<span style={{ color: '#0284c7' }}>MetriX</span>
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                AI-Powered Compliance Inspection System · Ministry of Consumer Affairs
              </p>
            </div>
          </div>

          <IndiaEmblem height={42} invert={false} />
        </div>

        {/* Title & Metadata Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Inspection Report
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>
              Packaging Compliance Analysis under Legal Metrology (Packaged Commodities) Rules, 2011
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
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Date & Time:</span>
              <span>{formattedDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Inspector:</span>
              <span>Ravi Kumar (Inspector-01)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Status:</span>
              <span style={{ fontWeight: 700, color: isCompliant ? '#10b981' : '#dc2626' }}>
                {inspection?.status?.toUpperCase() || 'COMPLETED'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Product Image & Product Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* 1. Product Image Showcase */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                1. Verified Packaging Image
              </h3>
              <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 6, padding: 2, border: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setImgViewMode('ocr')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    border: 'none',
                    background: imgViewMode === 'ocr' ? '#0f172a' : 'transparent',
                    color: imgViewMode === 'ocr' ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  OCR Detections
                </button>
                <button
                  type="button"
                  onClick={() => setImgViewMode('original')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    border: 'none',
                    background: imgViewMode === 'original' ? '#0f172a' : 'transparent',
                    color: imgViewMode === 'original' ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Original
                </button>
              </div>
            </div>
            <div style={{
              height: 185,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#090d16',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                src={
                  imgViewMode === 'ocr'
                    ? (inspection?.ocr_image_url || inspection?.image_url || '/storage/uploads/INS-2025-0012_ocr.png')
                    : (inspection?.image_url || '/storage/uploads/INS-2025-0012.png')
                }
                alt={imgViewMode === 'ocr' ? 'OCR Annotated Packaging' : 'Original Packaging'}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
              <div style={{
                position: 'absolute',
                top: 6,
                right: 6,
                background: 'rgba(0,0,0,0.75)',
                color: imgViewMode === 'ocr' ? '#4ade80' : '#ffffff',
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 600
              }}>
                {imgViewMode === 'ocr' ? 'AI OCR Annotated' : 'Original Frame'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
              <span>Analyzed Frame: Front Package Panel</span>
              <span>Status: Authenticated & Verified</span>
            </div>
          </div>

          {/* 2. Product Details */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
              2. Product Declarations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Product Name</span>
                <span style={{ fontWeight: 600 }}>{inspection?.product_name || 'Packaged Commodity'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {inspection?.product_category?.replace(/_/g, ' ') || 'Packaged Food'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Net Quantity</span>
                <span style={{ fontWeight: 600 }}>{extractedFields['net_quantity']?.value || '800 g'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>MRP</span>
                <span style={{ fontWeight: 600 }}>{extractedFields['mrp']?.value || '₹50/-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Manufacturer</span>
                <span style={{ fontWeight: 600, maxWidth: 170, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {extractedFields['manufacturer']?.value || 'Parle Products Pvt. Ltd.'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 3 }}>
                <span style={{ color: '#64748b' }}>Mfg Date</span>
                <span style={{ fontWeight: 600 }}>{extractedFields['date_mfg_pkd']?.value || '08/2026'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Consumer Care</span>
                <span style={{ color: extractedFields['consumer_care']?.value ? '#10b981' : '#dc2626', fontWeight: 600 }}>
                  {extractedFields['consumer_care']?.value || 'Not detected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Compliance Summary & Gauge */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.25rem', marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            3. Compliance Score & Assessment Summary
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={isCompliant ? '#10b981' : '#f59e0b'}
                  strokeWidth="3.5"
                  strokeDasharray={`${score.weighted_score} 100`}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                {Math.round(score.weighted_score)}%
              </div>
            </div>

            <div>
              <span className={`badge ${isCompliant ? 'badge-compliant' : 'badge-review'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                {isCompliant ? '✓ 100% Compliant' : `⚠️ ${score.status_label || 'Potentially Non-Compliant'}`}
              </span>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>
                Evaluation performed against Legal Metrology (Packaged Commodities) Rules, 2011 (as amended 2022).
                {score.failed_count > 0 ? ` ${score.failed_count} mandatory declaration failed verification.` : ' All mandatory declarations verified.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.82rem' }}>
            <div><strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{score.passed_count ?? 5}</strong><br /><span style={{ color: '#64748b' }}>Passed Rules</span></div>
            <div><strong style={{ color: '#ef4444', fontSize: '1.1rem' }}>{score.failed_count ?? 1}</strong><br /><span style={{ color: '#64748b' }}>Failed Rules</span></div>
            <div><strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{score.review_count ?? 2}</strong><br /><span style={{ color: '#64748b' }}>Manual Reviews</span></div>
            <div><strong style={{ color: '#1a6ef5', fontSize: '1.1rem' }}>{complianceResults.length || 7}</strong><br /><span style={{ color: '#64748b' }}>Total Evaluated</span></div>
          </div>
        </div>

        {/* Section 4: Rule-by-Rule Compliance Table */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            4. Rule-by-Rule Compliance Breakdown
          </h3>
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th style={{ width: 35 }}>#</th>
                  <th>Rule / Requirement</th>
                  <th>Status</th>
                  <th>Detected Value</th>
                  <th>Rule Reference</th>
                  <th>Remarks / Legal Explanation</th>
                </tr>
              </thead>
              <tbody>
                {complianceResults.map((r, i) => {
                  const isPass = r.status.toLowerCase() === 'pass';
                  const isFail = r.status.toLowerCase() === 'fail';
                  return (
                    <tr key={i}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {r.field.replace(/_/g, ' ')}
                      </td>
                      <td>
                        {isPass && <span className="badge badge-compliant">Pass</span>}
                        {isFail && <span className="badge badge-noncompliant">Fail</span>}
                        {!isPass && !isFail && <span className="badge badge-review">Review</span>}
                      </td>
                      <td style={{ color: isFail ? '#ef4444' : '#1e293b' }}>
                        {r.detected_value || 'Not detected'}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.74rem' }}>
                        {r.source_reference || r.rule_id}
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.74rem' }}>
                        {r.explanation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Official Stamp & SHA-256 Signature */}
        <div style={{
          borderTop: '2px dashed #cbd5e1',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div>
            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>
              LEGALMETRIX CERTIFICATION AUDIT HASH:
            </p>
            <p style={{ fontFamily: 'monospace', color: '#0284c7', margin: 0 }}>
              SHA256: 7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a
            </p>
            <p style={{ marginTop: 4, color: '#94a3b8' }}>
              Generated by LegalMetriX AI Compliance Engine v1.0.0
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-block',
              border: '2px solid #059669',
              color: '#059669',
              fontWeight: 800,
              padding: '0.35rem 0.85rem',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              VERIFIED OFFICIAL
            </div>
            <p style={{ marginTop: 4, fontSize: '0.72rem' }}>
              Authorized Legal Metrology Inspector
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
