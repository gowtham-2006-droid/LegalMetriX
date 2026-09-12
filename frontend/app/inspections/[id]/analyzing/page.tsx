'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Scan,
  CheckCircle2,
  Clock,
  Loader2,
  Info,
  Layers,
  FileImage,
  Tag,
  Calendar,
  Building,
  Check
} from 'lucide-react';

export default function AnalyzingProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'INS-2025-0012';

  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(18);
  const [productData, setProductData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch initial inspection details
  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const res = await fetch(`/api/inspection/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProductData(data);
        }
      } catch (e) {}
    };
    if (id) fetchInspection();
  }, [id]);

  // Run the real AI analysis pipeline
  useEffect(() => {
    let isCancelled = false;

    // Progression timers
    const timer1 = setTimeout(() => {
      if (!isCancelled) {
        setCurrentStep(2);
        setProgress(35);
      }
    }, 700);

    const timer2 = setTimeout(() => {
      if (!isCancelled) {
        setCurrentStep(3);
        setProgress(52);
      }
    }, 1400);

    const timer3 = setTimeout(() => {
      if (!isCancelled) {
        setCurrentStep(4);
        setProgress(70);
      }
    }, 2100);

    const timer4 = setTimeout(() => {
      if (!isCancelled) {
        setCurrentStep(5);
        setProgress(88);
      }
    }, 2800);

    const executeAnalysis = async () => {
      try {
        const token = localStorage.getItem('metrology_token');
        const res = await fetch(`/api/inspection/${id}/analyze`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: 'Analysis execution failed' }));
          throw new Error(err.detail || 'Analysis execution failed');
        }

        if (!isCancelled) {
          setCurrentStep(6);
          setProgress(100);
          setTimeout(() => {
            router.push(`/inspections/${id}`);
          }, 600);
        }
      } catch (err: any) {
        console.error('Analysis error:', err);
        if (!isCancelled) {
          setErrorMessage(err.message || 'Error occurred while analyzing product');
        }
      }
    };

    if (id) {
      executeAnalysis();
    }

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [id, router]);


  const steps = [
    {
      id: 1,
      title: 'Image preprocessing',
      desc: 'Enhancing image quality, correcting perspective and lighting.',
      time: '2.3s',
      icon: '🖼️',
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Detecting package regions',
      desc: 'Identifying label, text regions and product boundaries.',
      time: '3.1s',
      icon: '🎯',
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Extracting text with OCR',
      desc: 'Reading text from detected regions using PaddleOCR.',
      time: '4.8s',
      icon: '🔤',
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Identifying declarations',
      desc: 'Using AI/NLP to extract key information (MRP, quantity, manufacturer, etc.).',
      time: '5.6s',
      icon: '🧠',
      completed: currentStep > 4
    },
    {
      id: 5,
      title: 'Checking Legal Metrology rules',
      desc: 'Validating extracted information against applicable rules.',
      time: '3.2s',
      icon: '⚖️',
      completed: currentStep > 5,
      inProgress: currentStep === 5
    },
    {
      id: 6,
      title: 'Generating report',
      desc: 'Creating final compliance report and score.',
      time: currentStep > 6 ? '1.8s' : 'Pending',
      icon: '📄',
      completed: currentStep > 6,
      inProgress: currentStep === 6,
      pending: currentStep < 6
    },
  ];

  return (
    <div>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/inspections/new"
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
          Back to Upload
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
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
          <Scan size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
            Analyzing Product
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Our AI system is analyzing your product. This may take a few moments.
          </p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: AI Analysis Pipeline Stepper */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Analysis Pipeline</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                Overall Progress <strong style={{ color: '#1a6ef5' }}>{progress}%</strong>
              </span>
              <div style={{ width: 100, height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #1a6ef5, #38bdf8)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Stepper Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {steps.map((step) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 10,
                  border: step.inProgress ? '2px solid #1a6ef5' : '1px solid #e2e8f0',
                  background: step.inProgress ? '#f0f7ff' : '#ffffff',
                  boxShadow: step.inProgress ? '0 4px 12px rgba(26, 110, 245, 0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Icon Circle */}
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: step.completed ? '#ecfdf5' : (step.inProgress ? '#eff6ff' : '#f8fafc'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}>
                    {step.icon}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {step.completed ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#059669',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: '#ecfdf5',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 999
                    }}>
                      <Check size={14} /> Completed
                    </span>
                  ) : step.inProgress ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#1a6ef5',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: '#eff6ff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 999
                    }}>
                      <Loader2 size={14} className="spinner" /> In Progress
                    </span>
                  ) : (
                    <span style={{
                      color: '#94a3b8',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      padding: '0.25rem 0.65rem'
                    }}>
                      Pending
                    </span>
                  )}

                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 35, textAlign: 'right' }}>
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info Banner */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            borderRadius: 8,
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem'
          }}>
            <Info size={18} color="#1a6ef5" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.4 }}>
              <strong>This process may take 20–60 seconds depending on image quality and product complexity.</strong> You can leave this page – you'll be notified when the analysis is complete.
            </span>
          </div>
        </div>

        {/* Right Column: Product Image, Details, Steps Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Product Image */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                Product Image
              </h3>
              {productData?.panels && productData.panels.length > 1 && (
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: 8 }}>
                  Dual Surfaces
                </span>
              )}
            </div>

            {/* Real Uploaded Package Display */}
            {productData?.image_url ? (
              <div style={{
                height: 160,
                borderRadius: 8,
                background: '#0f172a',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={productData.image_url}
                  alt={productData.product_name || 'Uploaded package'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 6,
                  left: 8,
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(4px)',
                  color: '#f8fafc',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4
                }}>
                  📷 Original Upload
                </div>
              </div>
            ) : (
              <div style={{
                height: 140,
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#64748b'
              }}>
                <Loader2 size={24} className="animate-spin" color="#1a6ef5" />
                <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>Loading uploaded package...</span>
              </div>
            )}

            {/* Multi-Panel Thumbnails if Front and Back were uploaded */}
            {productData?.panels && productData.panels.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.6rem' }}>
                {productData.panels.map((panel: any) => (
                  <div key={panel.id || panel.panel} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '4px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 4, background: '#0f172a', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={panel.image_url} alt={panel.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {panel.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem' }}>
              <FileImage size={15} color="#64748b" />
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                {productData?.product_name || 'Uploaded Package Image'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                (Live Capture)
              </span>
            </div>
          </div>

          {/* Card 2: Product Details */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Product Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Inspection ID</span>
                <span style={{ fontWeight: 600, color: '#1a6ef5' }}>{id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                  {productData?.product_category || 'Food & Beverages'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Product Name</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                  {productData?.product_name || 'Packaged Commodity'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>
                  {productData?.status || 'Analyzing'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Uploaded</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                  {productData?.created_at
                    ? new Date(productData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Today'}
                </span>
              </div>
            </div>
          </div>


          {/* Card 3: Analysis Steps Summary */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Analysis Steps
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem' }}>
              {steps.map((st) => (
                <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {st.completed ? (
                      <CheckCircle2 size={14} color="#10b981" />
                    ) : st.inProgress ? (
                      <Loader2 size={14} color="#1a6ef5" className="spinner" />
                    ) : (
                      <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1' }} />
                    )}
                    <span style={{ color: st.completed || st.inProgress ? '#1e293b' : '#94a3b8' }}>
                      {st.title}
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>{st.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
