'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  AlertCircle,
  PhoneCall,
  XCircle,
  Copy,
  BookOpen,
  FileEdit,
  Check,
  Info,
  Loader2,
  Save
} from 'lucide-react';

interface ComplianceResultItem {
  rule_id: string;
  rule_version: number;
  field: string;
  status: string;
  severity: string;
  evidence?: string;
  explanation: string;
  detected_value?: string;
  expected_value?: string;
  source_reference?: string;
}

export default function ViolationDetailsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading violation...</p>
      </div>
    }>
      <ViolationDetailsContent />
    </Suspense>
  );
}

function ViolationDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || 'INS-2025-0012';
  const targetRuleId = searchParams.get('rule');

  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState<any>(null);
  const [violation, setViolation] = useState<ComplianceResultItem | null>(null);
  const [ocrLines, setOcrLines] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedView, setSelectedView] = useState('Front View');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Fetch Inspection metadata
        const inspRes = await fetch(`/api/inspection/${id}`, { headers });
        if (inspRes.ok) {
          const inspData = await inspRes.json();
          setInspection(inspData);
          if (inspData.notes && !inspData.notes.startsWith('Scenario:')) {
            setNotes(inspData.notes);
          }
        }

        // 2. Fetch Compliance Results
        const compRes = await fetch(`/api/inspection/${id}/compliance`, { headers });
        if (compRes.ok) {
          const compData = await compRes.json();
          const results: ComplianceResultItem[] = compData.results || [];
          
          let matched: ComplianceResultItem | undefined;
          if (targetRuleId) {
            matched = results.find(r => r.rule_id === targetRuleId);
          }
          if (!matched) {
            matched = results.find(r => r.status.toLowerCase() === 'fail') ||
                      results.find(r => r.status.toLowerCase() === 'review') ||
                      results[0];
          }
          setViolation(matched || null);
        }

        // 3. Fetch OCR Lines
        const ocrRes = await fetch(`/api/inspection/${id}/ocr`, { headers });
        if (ocrRes.ok) {
          const ocrData = await ocrRes.json();
          setOcrLines(ocrData.lines || []);
        }
      } catch (err) {
        console.error('Failed to load violation details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, targetRuleId]);

  const handleCopy = () => {
    if (ocrLines.length > 0) {
      navigator.clipboard.writeText(ocrLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const token = localStorage.getItem('metrology_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/inspection/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ notes })
      });
      alert('Inspector notes saved successfully.');
    } catch (e) {
      console.error('Failed to save notes:', e);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Loading violation details...</p>
      </div>
    );
  }

  const fieldName = violation?.field ? violation.field.replace(/_/g, ' ') : 'Consumer Care Information';

  return (
    <div>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '0.75rem' }}>
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
          Back to Results
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertCircle size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Violation Details
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Review the details of the identified compliance issue, evidence and applicable rule.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
            Inspection ID: {id}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {inspection?.created_at ? new Date(inspection.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Live Inspection'}
          </p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Image with Red Highlight & OCR Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Product Image with Highlighted Area */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Product Image with Highlighted Area
            </h3>

            {/* Visual Bounding Box Showcase */}
            <div style={{
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Package Visual */}
              <div style={{
                position: 'relative',
                width: 360,
                height: 220,
                background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
                border: '1px solid #ca8a04',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '0.75rem'
              }}>
                {/* MRP & Date badges */}
                <div style={{ position: 'absolute', top: 12, left: 14, background: '#9333ea', color: 'white', fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 3 }}>
                  Mfd. Detected
                </div>
                <div style={{ position: 'absolute', top: 12, right: 14, background: '#0284c7', color: 'white', fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 3 }}>
                  MRP Detected
                </div>

                {/* Center logo */}
                <div style={{
                  position: 'absolute',
                  top: 75,
                  left: 100,
                  background: '#b91c1c',
                  color: 'white',
                  padding: '0.35rem 0.9rem',
                  borderRadius: 6,
                  fontWeight: 900,
                  fontSize: '1.15rem'
                }}>
                  {inspection?.product_name || 'Commodity'}
                </div>

                <div style={{ position: 'absolute', bottom: 18, left: 14, background: '#f97316', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 3 }}>
                  Net Qty Detected
                </div>

                {/* RED DASHED HIGHLIGHT BOX: Missing Declaration */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 14,
                  width: 170,
                  height: 54,
                  border: '2px dashed #dc2626',
                  borderRadius: 6,
                  background: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: -16,
                    background: '#dc2626',
                    color: 'white',
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: 3,
                    whiteSpace: 'nowrap'
                  }}>
                    Expected {fieldName} (Not Detected)
                  </span>
                </div>
              </div>
            </div>

            {/* Carousel Thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
              {[
                { label: 'Front View' },
                { label: 'Back View' },
                { label: 'Side View (Left)' },
                { label: 'Side View (Right)' }
              ].map((t) => (
                <div
                  key={t.label}
                  onClick={() => setSelectedView(t.label)}
                  style={{
                    border: selectedView === t.label ? '2px solid #1a6ef5' : '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#ffffff'
                  }}
                >
                  <div style={{ height: 45, background: '#fef08a', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#854d0e', fontWeight: 700, marginBottom: 4 }}>
                    {inspection?.product_name ? inspection.product_name.slice(0, 10) : 'Sample'}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: selectedView === t.label ? '#1a6ef5' : '#64748b', fontWeight: 600 }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: OCR Text from Image (Relevant Portion) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                OCR Text from Image (Extracted)
              </h3>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                <Copy size={13} />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <pre style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#334155',
                lineHeight: 1.6,
                maxHeight: 150,
                overflowY: 'auto'
              }}>
                {ocrLines.length > 0 ? ocrLines.join('\n') : 'No OCR text available.'}
              </pre>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: 8,
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}>
                <Info size={16} color="#1a6ef5" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.4 }}>
                  {violation?.explanation || `No text corresponding to mandatory ${fieldName} was found in the OCR lines.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Violation Detail Card & Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Violation Details Header & Spec */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>
                  {fieldName}
                </h2>
                <span style={{
                  display: 'inline-block',
                  background: '#dc2626',
                  color: 'white',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4,
                  marginTop: 3
                }}>
                  {violation?.status?.toUpperCase() || 'NOT DETECTED'}
                </span>
              </div>
            </div>

            {/* Spec Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span style={{ fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <XCircle size={14} /> {violation?.status || 'Fail'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Severity</span>
                <span style={{ background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: 4 }}>
                  {violation?.severity?.toUpperCase() || 'HIGH'}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Detected Value</span>
                <p style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.8rem' }}>
                  {violation?.detected_value || 'No information identified in the submitted image.'}
                </p>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Expected Value</span>
                <p style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.8rem' }}>
                  {violation?.expected_value || `Mandatory declaration of ${fieldName} as per Legal Metrology (Packaged Commodities) Rules.`}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Rule Reference</span>
                <span style={{ fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
                  {violation?.rule_id || 'LM-DECL-004'}<br />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {violation?.source_reference || 'Legal Metrology (Packaged Commodities) Rules, 2011'}
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {inspection?.product_category?.replace(/_/g, ' ') || 'Packaged Commodity'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Action Required</span>
                <span style={{ color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ⚠️ Verify manually or issue notice
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Rule Description */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem', color: '#1a6ef5' }}>
              <BookOpen size={16} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Rule Description</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
              {violation?.explanation || 'Every package shall declare mandatory information including MRP, Net Quantity, Date of Packaging/Import, Manufacturer contact and Consumer Care cell details.'}
            </p>
          </div>

          {/* Card 3: Inspector Notes with Save Action */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#d97706' }}>
                <FileEdit size={16} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Inspector Notes</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{notes.length}/500</span>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  <Save size={12} />
                  {savingNotes ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <textarea
              className="input-field"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add official notes for this violation..."
              style={{ fontSize: '0.82rem', resize: 'vertical' }}
            />
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href={`/inspections/${id}`}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <ArrowLeft size={16} />
              Back to Results
            </Link>
            <button
              onClick={() => setVerified(!verified)}
              className="btn btn-primary"
              style={{ flex: 1.2 }}
            >
              <Check size={16} />
              {verified ? 'Verified by Officer' : 'Mark as Verified'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
