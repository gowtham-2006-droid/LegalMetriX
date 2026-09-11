'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  Info
} from 'lucide-react';

export default function VisualEvidencePage() {
  const params = useParams();
  const id = (params?.id as string) || 'INS-2025-0012';

  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState('Front View');

  const detectedElements = [
    { element: 'Product Name', status: 'pass', text: 'Parle-G Biscuits', conf: '98%', color: '#16a34a' },
    { element: 'MRP', status: 'pass', text: '₹50/-', conf: '99%', color: '#0284c7' },
    { element: 'Net Quantity', status: 'pass', text: '800 g', conf: '97%', color: '#f97316' },
    { element: 'Manufacturer', status: 'pass', text: 'Parle Products Pvt. Ltd. Vile Parle, Mumbai - 400057', conf: '94%', color: '#0891b2' },
    { element: 'Date of Manufacture', status: 'pass', text: '08/2026', conf: '91%', color: '#9333ea' },
    { element: 'Best Before / Expiry', status: 'fail', text: 'Not detected', conf: '—', color: '#ef4444' },
    { element: 'Consumer Care Information', status: 'fail', text: 'Not detected', conf: '—', color: '#dc2626' },
    { element: 'Country of Origin', status: 'warning', text: 'Not clearly visible', conf: '68%', color: '#f59e0b' },
    { element: 'Unit of Quantity', status: 'pass', text: 'g (grams)', conf: '96%', color: '#10b981' }
  ];

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
            11 Sep 2025, 10:24 AM
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
                onClick={() => setShowLabels(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Show All Detections
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>
            </div>
          </div>

          {/* Interactive Bounding Box Surface */}
          <div style={{
            position: 'relative',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease'
          }}>
            {/* Package Surface */}
            <div style={{
              position: 'relative',
              width: 440,
              height: 280,
              background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
              border: '2px solid #ca8a04',
              borderRadius: 10,
              boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
              padding: '1rem'
            }}>
              {/* Mfg Date BBox */}
              <div style={{
                position: 'absolute',
                top: 14,
                left: 14,
                border: '2.5px solid #9333ea',
                background: 'rgba(147, 51, 234, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 4
              }}>
                {showLabels && (
                  <span style={{ position: 'absolute', top: -14, left: 0, background: '#9333ea', color: 'white', fontSize: '0.58rem', padding: '0.05rem 0.35rem', borderRadius: 2 }}>
                    Mfg. Date: 08/2026
                  </span>
                )}
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#581c87' }}>Mfd. 08/2026</p>
              </div>

              {/* MRP BBox */}
              <div style={{
                position: 'absolute',
                top: 14,
                right: 20,
                border: '2.5px solid #0284c7',
                background: 'rgba(2, 132, 199, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 4
              }}>
                {showLabels && (
                  <span style={{ position: 'absolute', top: -14, right: 0, background: '#0284c7', color: 'white', fontSize: '0.58rem', padding: '0.05rem 0.35rem', borderRadius: 2 }}>
                    MRP: ₹50/-
                  </span>
                )}
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#075985' }}>MRP ₹50/-</p>
              </div>

              {/* Product Name BBox */}
              <div style={{
                position: 'absolute',
                top: 75,
                left: 110,
                border: '3px solid #16a34a',
                background: 'rgba(22, 163, 74, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: 8
              }}>
                {showLabels && (
                  <span style={{ position: 'absolute', top: -16, left: 0, background: '#16a34a', color: 'white', fontSize: '0.62rem', padding: '0.08rem 0.4rem', borderRadius: 3 }}>
                    Product Name
                  </span>
                )}
                <div style={{ background: '#b91c1c', color: 'white', padding: '0.25rem 0.85rem', borderRadius: 6, fontWeight: 900, fontSize: '1.3rem' }}>
                  Parle-G
                </div>
                <p style={{ fontSize: '0.65rem', color: '#713f12', textAlign: 'center', marginTop: 2 }}>
                  Original Gluco Biscuits
                </p>
              </div>

              {/* Net Quantity BBox */}
              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 14,
                border: '2.5px solid #f97316',
                background: 'rgba(249, 115, 22, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 4
              }}>
                {showLabels && (
                  <span style={{ position: 'absolute', top: -14, left: 0, background: '#f97316', color: 'white', fontSize: '0.58rem', padding: '0.05rem 0.35rem', borderRadius: 2 }}>
                    Net Quantity: 800 g
                  </span>
                )}
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c2d12' }}>NET WT. 800 g</p>
              </div>

              {/* Manufacturer BBox */}
              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 140,
                border: '2.5px solid #0891b2',
                background: 'rgba(8, 145, 178, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: 4
              }}>
                {showLabels && (
                  <span style={{ position: 'absolute', top: -14, left: 0, background: '#0891b2', color: 'white', fontSize: '0.58rem', padding: '0.05rem 0.35rem', borderRadius: 2 }}>
                    Manufacturer
                  </span>
                )}
                <p style={{ fontSize: '0.6rem', color: '#155e75', lineHeight: 1.1 }}>
                  Parle Products Pvt. Ltd.<br />Vile Parle, Mumbai - 400057
                </p>
              </div>

              {/* RED DASHED: Consumer Care Not Detected */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                right: 14,
                border: '2.5px dashed #dc2626',
                background: 'rgba(220, 38, 38, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: 6,
                width: 135,
                height: 48
              }}>
                <span style={{
                  position: 'absolute',
                  top: -14,
                  right: 0,
                  background: '#dc2626',
                  color: 'white',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  padding: '0.05rem 0.35rem',
                  borderRadius: 2,
                  whiteSpace: 'nowrap'
                }}>
                  Consumer Care: Not Detected
                </span>
              </div>
            </div>
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
                  Parle-G
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
                      <td style={{ fontWeight: 600 }}>{el.element}</td>
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
                    <XCircle size={13} color="#ef4444" /> Not Detected (Potential Violation)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <AlertTriangle size={13} color="#f59e0b" /> Partially Detected / Unclear
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
                  Bounding boxes show the regions where information was detected by AI. Click on any item in the detected elements list to highlight the corresponding region on the image.
                </span>
              </div>
            </div>
          </div>

          {/* Download Annotated Image Button */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            Download Annotated Image
          </button>
        </div>
      </div>
    </div>
  );
}
