'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertCircle,
  PhoneCall,
  XCircle,
  Copy,
  BookOpen,
  FileEdit,
  Check,
  Info
} from 'lucide-react';

export default function ViolationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'INS-2025-0012';

  const [notes, setNotes] = useState('');
  const [selectedView, setSelectedView] = useState('Front View');
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Parle-G Original Gluco Biscuits\nNet Wt. 800 g\nMfd. 08/2026\nMRP ₹50/-\nParle Products Pvt. Ltd.\nVile Parle, Mumbai - 400057`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            11 Sep 2025, 10:24 AM
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
              {/* Package Mock */}
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
                  Mfd. 08/2026
                </div>
                <div style={{ position: 'absolute', top: 12, right: 14, background: '#0284c7', color: 'white', fontSize: '0.62rem', padding: '0.1rem 0.35rem', borderRadius: 3 }}>
                  MRP ₹50/-
                </div>

                {/* Parle-G center logo */}
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
                  Parle-G
                </div>

                <div style={{ position: 'absolute', bottom: 18, left: 14, background: '#f97316', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 3 }}>
                  Net Wt. 800 g
                </div>

                {/* RED DASHED HIGHLIGHT BOX: Expected Consumer Care Information */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 14,
                  width: 170,
                  height: 54,
                  border: '2px dashed #dc2626',
                  borderRadius: 6,
                  background: 'rgba(239, 68, 68, 0.1)',
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
                    Expected Consumer Care Information (Not Detected)
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
                    Parle-G
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
                OCR Text from Image (Relevant Portion)
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
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#334155',
                lineHeight: 1.6
              }}>
{`Parle-G Original Gluco Biscuits
Net Wt. 800 g
Mfd. 08/2026
MRP ₹50/-
Parle Products Pvt. Ltd.
Vile Parle, Mumbai - 400057
...`}
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
                  No text related to consumer care (e.g. customer care number, email or address) was found in the OCR output.
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
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Consumer Care Information
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
                  NOT DETECTED
                </span>
              </div>
            </div>

            {/* Spec Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span style={{ fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <XCircle size={14} /> Not Detected
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Severity</span>
                <span style={{ background: '#dc2626', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: 4 }}>
                  HIGH
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Detected</span>
                <p style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.8rem' }}>
                  No consumer-care information was identified in the submitted images.
                </p>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Expected</span>
                <p style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.8rem' }}>
                  Mandatory declaration of consumer care details (name, address, phone number or email) as per Legal Metrology requirements.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Rule Reference</span>
                <span style={{ fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
                  LM-DECL-004<br />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal Metrology (Packaged Commodities) Rules, 2011 – Rule 6(1)(f)</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600 }}>Mandatory Declaration</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Action</span>
                <span style={{ color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ⚠️ Verify manually
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
              Every package shall declare the name and complete address of the manufacturer, packer or importer and the consumer care details (telephone number, email or postal address) for consumer complaints.
            </p>
          </div>

          {/* Card 3: Inspector Notes */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#d97706' }}>
                <FileEdit size={16} />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Inspector Notes</h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{notes.length}/500</span>
            </div>
            <textarea
              className="input-field"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this violation..."
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
              {verified ? 'Verified' : 'Mark as Verified'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
