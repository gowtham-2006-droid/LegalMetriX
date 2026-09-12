'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Info,
  Loader2
} from 'lucide-react';

interface DetectedElement {
  element: string;
  field_name: string;
  status: 'pass' | 'fail' | 'warning';
  text: string;
  conf: string;
  color: string;
}

export default function VisualEvidencePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading evidence...</p>
      </div>
    }>
      <VisualEvidenceContent />
    </Suspense>
  );
}

function VisualEvidenceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || 'INS-2025-0012';
  const initialSelectedField = searchParams.get('field');

  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState<any>(null);
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);
  const [evidenceTab, setEvidenceTab] = useState<'ocr' | 'original'>('ocr');
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedElement, setSelectedElement] = useState<string | null>(initialSelectedField);
  const [selectedView, setSelectedView] = useState('Front View');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Fetch metadata
        const inspRes = await fetch(`/api/inspection/${id}`, { headers });
        if (inspRes.ok) {
          const inspData = await inspRes.json();
          setInspection(inspData);
        }

        // 2. Fetch Extracted Data & Compliance
        const [fieldsRes, compRes] = await Promise.all([
          fetch(`/api/inspection/${id}/extracted-data`, { headers }),
          fetch(`/api/inspection/${id}/compliance`, { headers })
        ]);

        const fieldsData = fieldsRes.ok ? await fieldsRes.json() : { fields: [] };
        const compData = compRes.ok ? await compRes.json() : { results: [] };

        const fieldsMap: Record<string, any> = {};
        (fieldsData.fields || []).forEach((f: any) => {
          fieldsMap[f.field_name] = f;
        });

        const colorMap: Record<string, string> = {
          product_name: '#16a34a',
          mrp: '#0284c7',
          net_quantity: '#f97316',
          manufacturer: '#0891b2',
          date_mfg_pkd: '#9333ea',
          consumer_care: '#dc2626',
          country_of_origin: '#f59e0b',
          unit_sale_price: '#10b981'
        };

        const elements: DetectedElement[] = (compData.results || []).map((r: any) => {
          const f = fieldsMap[r.field];
          const st = r.status.toLowerCase();
          const statusVal: 'pass' | 'fail' | 'warning' =
            st === 'pass' ? 'pass' : st === 'fail' ? 'fail' : 'warning';

          const conf = f && f.confidence ? `${Math.round(f.confidence * 100)}%` : '—';
          const text = r.detected_value || (f && f.value) || 'Not detected';

          return {
            element: r.field.replace(/_/g, ' '),
            field_name: r.field,
            status: statusVal,
            text,
            conf,
            color: colorMap[r.field] || (statusVal === 'pass' ? '#16a34a' : statusVal === 'fail' ? '#dc2626' : '#f59e0b')
          };
        });

        if (elements.length > 0) {
          setDetectedElements(elements);
          if (initialSelectedField) {
            setSelectedElement(initialSelectedField.replace(/_/g, ' '));
          }
        }
      } catch (err) {
        console.error('Failed to load visual evidence:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, initialSelectedField]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={36} className="animate-spin" color="#1a6ef5" />
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Loading visual evidence canvas...</p>
      </div>
    );
  }

  const handleDownload = () => {
    window.open(`/api/inspection/${id}/report`, '_blank');
  };

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
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a6ef5'
          }}>
            <FileCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Visual Evidence
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Detected information and potential violations highlighted on the product image.
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

      {/* Main 2-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Product Image with AI Detections & Zoom Controls */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Product Image with AI Detections
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEvidenceTab('ocr')}
                className={`btn ${evidenceTab === 'ocr' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                OCR Annotated Image
              </button>
              <button
                onClick={() => setEvidenceTab('original')}
                className={`btn ${evidenceTab === 'original' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Original Image
              </button>
            </div>
          </div>

          {/* Panel Selector Pill if multiple surfaces */}
          {inspection?.panels && inspection.panels.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              marginBottom: '0.75rem',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: 8
            }}>
              {inspection.panels.map((p: any, idx: number) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setActivePanelIndex(idx)}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.76rem',
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

          {/* Interactive Image Surface */}
          <div style={{
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#0f172a',
            border: '1px solid #e2e8f0',
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {(() => {
              const activePanel = (inspection?.panels && inspection.panels[activePanelIndex]) || null;
              const activeSrc = activePanel
                ? (evidenceTab === 'ocr'
                    ? (activePanel.ocr_image_url || activePanel.image_url)
                    : activePanel.image_url)
                : (evidenceTab === 'ocr'
                    ? (inspection?.ocr_image_url || inspection?.image_url)
                    : inspection?.image_url);

              if (activeSrc) {
                return (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <img
                      src={activeSrc}
                      alt="Visual Evidence"
                      style={{
                        maxWidth: '95%',
                        maxHeight: '92%',
                        objectFit: 'contain',
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.2s ease',
                        borderRadius: 6
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#f8fafc',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 4
                    }}>
                      {activePanel ? `${activePanel.label}: ` : ''}
                      {evidenceTab === 'ocr' ? '🔍 OCR Annotated Surface' : '📷 Original Surface'}
                    </div>
                  </div>
                );
              }

              return (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  No evidence image available.
                </div>
              );
            })()}
          </div>

          {/* Zoom Toolbar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              <ZoomIn size={14} /> Zoom In
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              <ZoomOut size={14} /> Zoom Out
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              <Maximize2 size={14} /> Fit to Screen
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
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

        {/* Right Column: Detected Elements Table, Legend, Download */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Detected Elements Table */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Detected Elements
            </h3>

            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Status</th>
                    <th>Detected Text / Region</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {detectedElements.map((el, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedElement(el.element)}
                      style={{
                        cursor: 'pointer',
                        background: selectedElement === el.element ? '#eff6ff' : 'transparent'
                      }}
                    >
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{el.element}</td>
                      <td>
                        {el.status === 'pass' && <CheckCircle2 size={15} color="#10b981" />}
                        {el.status === 'fail' && <XCircle size={15} color="#ef4444" />}
                        {el.status === 'warning' && <AlertTriangle size={15} color="#f59e0b" />}
                      </td>
                      <td style={{ maxWidth: 140, wordBreak: 'break-word', color: el.status === 'fail' ? '#ef4444' : '#1e293b' }}>
                        {el.text}
                      </td>
                      <td style={{ fontWeight: 600, color: el.conf !== '—' ? '#059669' : '#94a3b8' }}>
                        {el.conf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend & Info Box */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Legend</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={13} color="#10b981" /> Detected (Compliant)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <XCircle size={13} color="#ef4444" /> Not Detected (Violation)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <AlertTriangle size={13} color="#f59e0b" /> Low Confidence / Review
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#9333ea' }} /> Information Field
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, border: '1.5px dashed #dc2626' }} /> Expected but Not Found
                  </div>
                </div>
              </div>

              {/* Blue Info Notice */}
              <div style={{
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: 8,
                padding: '0.75rem',
                fontSize: '0.72rem',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem'
              }}>
                <Info size={16} color="#1a6ef5" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  Bounding boxes show the regions detected by OCR & CV models. Click any row to highlight that region on the package canvas.
                </span>
              </div>
            </div>
          </div>

          {/* Download Official Certificate Button */}
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            Download Official Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
