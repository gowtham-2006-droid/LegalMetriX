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

  const [currentStep, setCurrentStep] = useState(5);
  const [progress, setProgress] = useState(67);

  useEffect(() => {
    // Step progression animation
    const timer1 = setTimeout(() => {
      setCurrentStep(6);
      setProgress(88);
    }, 1500);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 2800);

    const timer3 = setTimeout(() => {
      router.push(`/inspections/${id}`);
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
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
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Product Image
            </h3>

            {/* Parle-G Biscuit Graphic Mock */}
            <div style={{
              height: 140,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
              border: '1px solid #facc15',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                background: '#b91c1c',
                color: 'white',
                padding: '0.35rem 1.2rem',
                borderRadius: 6,
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}>
                Parle-G
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#713f12', marginTop: 4 }}>
                Original Gluco Biscuits
              </p>
              <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: '0.7rem', color: '#854d0e' }}>
                Net Wt. 800 g
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem' }}>
              <FileImage size={15} color="#64748b" />
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>parle-g-biscuit.jpg</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(1.8 MB)</span>
            </div>
          </div>

          {/* Card 2: Product Details */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Product Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Food & Beverages</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Product Name</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Parle-G Biscuits</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Brand</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>Parle</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Uploaded</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>11 Sep 2025, 10:24 AM</span>
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
