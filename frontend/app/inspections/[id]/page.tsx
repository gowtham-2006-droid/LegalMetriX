'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2
} from 'lucide-react';

interface InspectionPanel {
  id: number;
  panel: string;
  label: string;
  image_url: string;
  processed_image_url?: string;
  ocr_image_url?: string;
}

interface InspectionDetail {
  id: string;
  product_name: string;
  product_category: string;
  status: string;
  notes?: string;
  created_at: string;
  image_url?: string;
  processed_image_url?: string;
  ocr_image_url?: string;
  panels?: InspectionPanel[];
  pdf_url?: string;
  compliance_score?: {
    weighted_score: number;
    status_label: string;
    passed_count: number;
    failed_count: number;
    review_count: number;
    na_count: number;
  };
}

interface ComplianceResultItem {
  rule_id: string;
  rule_version: number;
  field: string;
  status: string; // Pass, Fail, Review
  severity: string;
  evidence?: string;
  explanation: string;
  detected_value?: string;
  expected_value?: string;
  source_reference?: string;
}

interface ExtractedFieldItem {
  field_name: string;
  value?: string;
  normalized_value?: any;
  confidence: number;
  source_text?: string;
  source_bbox?: any;
}

export default function InspectionResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'INS-2025-0012';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspection, setInspection] = useState<InspectionDetail | null>(null);
  const [complianceResults, setComplianceResults] = useState<ComplianceResultItem[]>([]);
  const [scoreSummary, setScoreSummary] = useState<any>(null);
  const [extractedFields, setExtractedFields] = useState<Record<string, ExtractedFieldItem>>({});
  const [ocrLines, setOcrLines] = useState<string[]>([]);

  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [imageTab, setImageTab] = useState<'original' | 'processed' | 'ocr'>('processed');
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Fetch Inspection metadata
        const inspRes = await fetch(`/api/inspection/${id}`, { headers });
        if (!inspRes.ok) {
          throw new Error('Inspection not found');
        }
        const inspData = await inspRes.json();
        setInspection(inspData);

        // 2. Fetch Compliance evaluation
        const compRes = await fetch(`/api/inspection/${id}/compliance`, { headers });
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplianceResults(compData.results || []);
          setScoreSummary(compData.compliance_score || null);
        }

        // 3. Fetch Extracted Fields
        const fieldsRes = await fetch(`/api/inspection/${id}/extracted-data`, { headers });
        if (fieldsRes.ok) {
          const fieldsData = await fieldsRes.json();
          const map: Record<string, ExtractedFieldItem> = {};
          (fieldsData.fields || []).forEach((f: ExtractedFieldItem) => {
            map[f.field_name] = f;
          });
          setExtractedFields(map);
        }

        // 4. Fetch OCR lines
        const ocrRes = await fetch(`/api/inspection/${id}/ocr`, { headers });
        if (ocrRes.ok) {
          const ocrData = await ocrRes.json();
          setOcrLines(ocrData.lines || []);
        }
      } catch (err: any) {
        console.error('Failed to load inspection data:', err);
        setError(err.message || 'Error loading inspection data');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Loading inspection results...</p>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: 600, margin: '2rem auto' }}>
        <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inspection Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          {error || `Unable to locate inspection ${id} in the database.`}
        </p>
        <Link href="/inspections/new" className="btn btn-primary">
          Start New Inspection
        </Link>
      </div>
    );
  }

  const score = scoreSummary || inspection.compliance_score || {
    weighted_score: 0,
    status_label: 'Pending',
    passed_count: 0,
    failed_count: 0,
    review_count: 0,
    na_count: 0
  };

  const isCompliant = score.weighted_score >= 85;
  const isWarning = score.weighted_score >= 60 && score.weighted_score < 85;
  const isFailed = score.weighted_score < 60;

  const filteredChecks = showOnlyIssues
    ? complianceResults.filter((c) => c.status.toLowerCase() !== 'pass')
    : complianceResults;

  // Format date helper
  const formattedDate = inspection.created_at
    ? new Date(inspection.created_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : 'Recently analyzed';

  const criticalIssues = complianceResults.filter((c) => c.status.toLowerCase() === 'fail');
  const warningIssues = complianceResults.filter((c) => c.status.toLowerCase() === 'review');

  // Multi-tier declaration resolver: extractedFields -> aliases -> compliance results -> grounded OCR lines
  const getFieldValue = (fieldName: string, aliases: string[] = []): string | null => {
    // 1. Direct extracted field
    const directVal = extractedFields[fieldName]?.value;
    if (directVal && !directVal.toLowerCase().includes('not detected')) {
      return directVal;
    }
    // 2. Aliases
    for (const alias of aliases) {
      const aliasVal = extractedFields[alias]?.value;
      if (aliasVal && !aliasVal.toLowerCase().includes('not detected')) {
        return aliasVal;
      }
    }
    // 3. Check compliance results detected_value
    const compMatch = complianceResults.find(
      (c) => (c.field === fieldName || aliases.includes(c.field)) &&
        c.detected_value &&
        !c.detected_value.toLowerCase().includes('not detected') &&
        !c.detected_value.toLowerCase().includes('not visible')
    );
    if (compMatch?.detected_value) {
      return compMatch.detected_value;
    }
    // 4. Check grounded OCR lines tagged with this field
    const ocrMatch = ocrLines.find(
      (l: any) => typeof l === 'object' && (l.field === fieldName || aliases.includes(l.field)) && l.text
    ) as any;
    if (ocrMatch?.text) {
      return ocrMatch.text;
    }
    return null;
  };

  const displayDateMfg = getFieldValue('date_mfg_pkd', ['date_of_manufacture', 'mfg_date', 'date']);
  const displayMrp = getFieldValue('mrp', ['max_retail_price', 'price']);
  const displayNetQty = getFieldValue('net_quantity', ['quantity', 'net_weight', 'net_volume']);
  const displayManufacturer = getFieldValue('manufacturer', ['mfg_name', 'packer', 'manufacturer_name']);

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
              Inspection ID: {inspection.id}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {formattedDate}
            </p>
          </div>
          <a
            href={`/api/inspection/${inspection.id}/report`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
          >
            <Download size={15} />
            Download Report
          </a>
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
      <div className="grid-inspection-detail" style={{ marginBottom: '1.25rem' }}>
        {/* Col 1: Product Image (Analyzed) with Interactive Views */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                Product Image (Analyzed)
              </h3>
              {inspection.panels && inspection.panels.length > 1 && (
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '2px 7px', borderRadius: 10 }}>
                  2 Surfaces Analyzed
                </span>
              )}
            </div>

            {/* Multi-Panel Switcher Pill */}
            {inspection.panels && inspection.panels.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '0.35rem',
                marginBottom: '0.65rem',
                background: '#f1f5f9',
                padding: '3px',
                borderRadius: 8
              }}>
                {inspection.panels.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setActivePanelIndex(idx)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: 'none',
                      background: activePanelIndex === idx ? '#1a6ef5' : 'transparent',
                      color: activePanelIndex === idx ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{p.panel === 'front' ? '📷' : '📦'}</span>
                    <span>{p.label || (p.panel === 'front' ? 'Front Face' : 'Back Panel')}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Package Container */}
            <div style={{
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#0f172a',
              border: '1px solid #e2e8f0',
              height: 360,
              minHeight: 360,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(() => {
                const activePanel = (inspection.panels && inspection.panels[activePanelIndex]) || null;
                const rawImg = activePanel
                  ? (imageTab === 'original'
                      ? activePanel.image_url
                      : imageTab === 'processed'
                      ? (activePanel.processed_image_url || activePanel.image_url)
                      : (activePanel.ocr_image_url || activePanel.image_url))
                  : (imageTab === 'original'
                      ? inspection.image_url
                      : imageTab === 'processed'
                      ? (inspection.processed_image_url || inspection.image_url)
                      : (inspection.ocr_image_url || inspection.image_url));

                const imgTimestamp = inspection?.created_at ? new Date(inspection.created_at).getTime() : Date.now();
                const currentImg = rawImg ? `${rawImg}?t=${imgTimestamp}` : null;

                if (currentImg) {
                  return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img
                        src={currentImg}
                        alt={`${imageTab} view`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />

                      {/* Overlay if OCR View has 0 detected lines */}
                      {imageTab === 'ocr' && ocrLines.length === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(15, 23, 42, 0.92)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(245, 158, 11, 0.5)',
                          padding: '1rem 1.25rem',
                          borderRadius: 10,
                          color: '#f8fafc',
                          textAlign: 'center',
                          maxWidth: '85%',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          zIndex: 10
                        }}>
                          <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>🔍</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fef3c7' }}>
                            No Text Declarations Detected
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.25rem', lineHeight: 1.4 }}>
                            The AI OCR vision engine scanned this package surface and found zero legible printed text or statutory labels.
                          </div>
                        </div>
                      )}

                      <div style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#f8fafc',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 4
                      }}>
                        {activePanel ? `${activePanel.label}: ` : ''}
                        {imageTab === 'original' && '📷 Original Upload'}
                        {imageTab === 'processed' && '⚡ CLAHE Normalized'}
                        {imageTab === 'ocr' && (ocrLines.length > 0 ? `🔍 AI OCR View (${ocrLines.length} Bounding Boxes)` : '🔍 AI OCR View (0 Detections)')}
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    No package image available.
                  </div>
                );
              })()}
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
              OCR View ({ocrLines.length})
            </button>
            <Link
              href={`/inspections/${inspection.id}/evidence`}
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

          {/* Raw OCR Detections drawer when OCR view is active */}
          {imageTab === 'ocr' && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                  Extracted OCR Lines ({ocrLines.length})
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {ocrLines.length === 0 ? 'No text detected' : `${ocrLines.length} regions grounded`}
                </span>
              </div>
              {ocrLines.length === 0 ? (
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                  No text declarations detected on package canvas.
                </p>
              ) : (
                <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {ocrLines.map((line: any, idx: number) => {
                    const text = typeof line === 'string' ? line : line.text;
                    const conf = typeof line === 'object' && line.confidence ? `${Math.round(line.confidence * 100)}%` : null;
                    const fieldTag = typeof line === 'object' && line.field && line.field !== 'general' ? line.field : null;
                    return (
                      <div key={idx} style={{
                        padding: '0.3rem 0.5rem',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        fontSize: '0.74rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                          {fieldTag && (
                            <span style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: '#1a6ef5',
                              background: '#eff6ff',
                              padding: '1px 4px',
                              borderRadius: 3,
                              flexShrink: 0
                            }}>
                              {fieldTag.replace('_', ' ')}
                            </span>
                          )}
                          <span style={{ color: '#334155', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {text}
                          </span>
                        </div>
                        {conf && (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            color: '#10b981',
                            background: '#ecfdf5',
                            padding: '1px 5px',
                            borderRadius: 4,
                            flexShrink: 0
                          }}>
                            {conf}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Col 2: Compliance Score & Extracted Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={isCompliant ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3.5"
                    strokeDasharray={`${score.weighted_score} 100`}
                  />
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
                  {Math.round(score.weighted_score)}%
                </div>
              </div>

              {/* Status Banner */}
              <div style={{
                background: isCompliant ? '#f0fdf4' : isWarning ? '#fffbeb' : '#fef2f2',
                border: `1px solid ${isCompliant ? '#bbf7d0' : isWarning ? '#fde68a' : '#fecaca'}`,
                borderRadius: 8,
                padding: '0.6rem 0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: isCompliant ? '#15803d' : isWarning ? '#d97706' : '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}>
                  {isCompliant ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  {score.status_label || (isCompliant ? 'Compliant' : 'Potentially Non-Compliant')}
                </div>
                <p style={{
                  fontSize: '0.72rem',
                  color: isCompliant ? '#166534' : isWarning ? '#92400e' : '#991b1b',
                  marginTop: 2,
                  lineHeight: 1.3
                }}>
                  {isCompliant
                    ? 'All mandatory packaging declarations are fully present and verified.'
                    : 'Some mandatory declarations are missing or require manual inspector review.'}
                </p>
              </div>
            </div>

            {/* Spec List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Product</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{inspection.product_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
                  {inspection.product_category.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Brand</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                  {inspection.product_name.split(' ')[0] || 'Declared Brand'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Net Quantity (Declared)</span>
                <span style={{ fontWeight: 600, color: displayNetQty ? '#1e293b' : '#dc2626' }}>
                  {displayNetQty || 'Not Detected'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>MRP (Declared)</span>
                <span style={{ fontWeight: 600, color: displayMrp ? '#1e293b' : '#dc2626' }}>
                  {displayMrp || 'Not Detected'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Manufacturer</span>
                <span style={{ fontWeight: 600, color: displayManufacturer ? '#1e293b' : '#dc2626', maxWidth: 170, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayManufacturer || 'Not Detected'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date of Manufacture</span>
                <span style={{ fontWeight: 600, color: displayDateMfg ? '#1e293b' : '#dc2626' }}>
                  {displayDateMfg || 'Not Detected'}
                </span>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(55px, 1fr))', textAlign: 'center', gap: '0.35rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Total</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                  {complianceResults.length || 7}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#059669' }}>Passed</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                  {score.passed_count ?? 0}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#dc2626' }}>Failed</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>
                  {score.failed_count ?? 0}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#d97706' }}>Warnings</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                  {score.review_count ?? 0}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: '#2563eb' }}>Review</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a6ef5' }}>
                  {score.review_count ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Key Issues Alert */}
          <div style={{
            background: criticalIssues.length > 0 ? '#fff5f5' : '#f0fdf4',
            border: `1px solid ${criticalIssues.length > 0 ? '#fed7d7' : '#bbf7d0'}`,
            borderRadius: 10,
            padding: '0.85rem 1rem',
            fontSize: '0.78rem'
          }}>
            <p style={{
              fontWeight: 700,
              color: criticalIssues.length > 0 ? '#9b2c2c' : '#166534',
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {criticalIssues.length > 0 ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {criticalIssues.length > 0 ? `${criticalIssues.length} Non-Compliant Issue${criticalIssues.length > 1 ? 's' : ''}` : 'Compliance Check Clear'}
            </p>
            {criticalIssues.length > 0 ? (
              <div style={{ maxHeight: 110, overflowY: 'auto', paddingRight: 4 }}>
                {criticalIssues.map((iss, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: '#991b1b', fontSize: '0.72rem', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                    <span style={{ fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                      • {iss.field.replace(/_/g, ' ')}:
                    </span>
                    <span style={{ color: '#7f1d1d' }}>
                      {iss.rule_id} missing or non-compliant
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#15803d', fontSize: '0.75rem' }}>
                All mandatory rules passed according to Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            )}
            {warningIssues.length > 0 && (
              <div style={{ maxHeight: 60, overflowY: 'auto', marginTop: 4, paddingRight: 4, borderTop: '1px dashed #fed7d7', paddingTop: 4 }}>
                <p style={{ color: '#dd6b20', fontWeight: 600, fontSize: '0.7rem', marginBottom: 2 }}>
                  • {warningIssues.length} Warning{warningIssues.length > 1 ? 's' : ''} / Reviews
                </p>
                {warningIssues.map((w, i) => (
                  <p key={i} style={{ color: '#7b341e', fontSize: '0.68rem', paddingLeft: '0.5rem', marginBottom: 2 }}>
                    {w.field.replace(/_/g, ' ')}: {w.detected_value || 'Review Required'}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="card" style={{ padding: '0.85rem 1rem' }}>
            <Link
              href={`/reports?id=${inspection.id}`}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem', marginBottom: '0.5rem' }}
            >
              <FileText size={15} />
              View Official Certificate
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
                href={`/inspections/${inspection.id}/analyzing`}
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
              {filteredChecks.map((row, idx) => {
                const statusLower = row.status.toLowerCase();
                const isPass = statusLower === 'pass';
                const isIssue = statusLower === 'fail';
                const isWarn = statusLower === 'review';
                const confVal = extractedFields[row.field]?.confidence
                  ? `${Math.round(extractedFields[row.field].confidence * 100)}%`
                  : '—';

                return (
                  <tr key={row.rule_id || idx}>
                    <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {row.field.replace(/_/g, ' ')}
                    </td>
                    <td>
                      {isPass && (
                        <span className="badge badge-compliant">
                          <Check size={12} /> Pass
                        </span>
                      )}
                      {isIssue && (
                        <span className="badge badge-noncompliant">
                          <XCircle size={12} /> Issue
                        </span>
                      )}
                      {isWarn && (
                        <span className="badge badge-review">
                          <AlertTriangle size={12} /> Warning
                        </span>
                      )}
                    </td>
                    <td style={{
                      fontWeight: !row.detected_value || row.detected_value === 'Not detected' ? 400 : 600,
                      color: !row.detected_value || row.detected_value === 'Not detected' ? '#ef4444' : '#1e293b'
                    }}>
                      {row.detected_value || 'Not detected'}
                    </td>
                    <td style={{ color: confVal !== '—' ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                      {confVal}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {row.source_reference || row.rule_id}
                    </td>
                    <td>
                      <Link
                        href={isIssue ? `/inspections/${inspection.id}/violation?rule=${row.rule_id}` : `/inspections/${inspection.id}/evidence?field=${row.field}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                      >
                        <Eye size={12} /> View
                      </Link>
                    </td>
                    <td style={{ fontSize: '0.74rem', color: isIssue ? '#dc2626' : '#64748b', maxWidth: 280, lineHeight: 1.35 }}>
                      {row.explanation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
