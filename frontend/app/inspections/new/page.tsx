'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  UploadCloud,
  CheckCircle2,
  X,
  Info,
  Lightbulb,
  Utensils,
  Home,
  Heart,
  Leaf,
  Pill,
  MoreHorizontal
} from 'lucide-react';

export default function NewInspectionPage() {
  const router = useRouter();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState('Food & Beverages');
  const [productName, setProductName] = useState('Parle-G Biscuits');
  const [brand, setBrand] = useState('Parle');
  const [notes, setNotes] = useState('');

  // Multi-surface package states: Front and Back panels
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>('/storage/uploads/scenario_1_compliant.png');
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const [scenarioId, setScenarioId] = useState<string | null>('scenario_1_compliant');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { id: 'Food & Beverages', label: 'Food & Beverages', icon: Utensils },
    { id: 'Household Products', label: 'Household Products', icon: Home },
    { id: 'Personal Care', label: 'Personal Care', icon: Heart },
    { id: 'Agricultural Products', label: 'Agricultural Products', icon: Leaf },
    { id: 'Pharmaceuticals', label: 'Pharmaceuticals', icon: Pill },
    { id: 'Others', label: 'Others', icon: MoreHorizontal }
  ];

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontFile(file);
      setFrontPreview(URL.createObjectURL(file));
      setScenarioId(null);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackFile(file);
      setBackPreview(URL.createObjectURL(file));
      setScenarioId(null);
    }
  };

  const handleSelectScenario = (scId: string, name: string, cat: string) => {
    setScenarioId(scId);
    setFrontFile(null);
    setBackFile(null);
    setFrontPreview(`/storage/uploads/${scId}.png`);
    setBackPreview(null);
    setProductName(name);
    setCategory(cat);
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    if (!frontFile && !backFile && !scenarioId) {
      setErrorMessage('Please upload at least one package panel (Front Face or Back Panel).');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('metrology_token');
      // 1. Create draft inspection
      const createRes = await fetch('/api/inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          product_name: productName || 'Packaged Commodity',
          product_category: category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_'),
          scenario_hint: scenarioId || undefined,
          notes: notes || `Inspected by Officer`
        })
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({ detail: 'Failed to create inspection' }));
        throw new Error(err.detail || 'Failed to create inspection');
      }

      const createData = await createRes.json();
      const inspectionId = createData.inspection_id;

      // 2. Upload Front Panel if provided
      if (frontFile) {
        const fdFront = new FormData();
        fdFront.append('file', frontFile);
        fdFront.append('panel_type', 'front');
        await fetch(`/api/inspection/${inspectionId}/image`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fdFront
        });
      }

      // 3. Upload Back Panel if provided
      if (backFile) {
        const fdBack = new FormData();
        fdBack.append('file', backFile);
        fdBack.append('panel_type', 'back');
        await fetch(`/api/inspection/${inspectionId}/image`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fdBack
        });
      }

      // 4. Scenario fallback if no custom files uploaded
      if (!frontFile && !backFile && scenarioId) {
        const fdScenario = new FormData();
        fdScenario.append('scenario_id', scenarioId);
        fdScenario.append('panel_type', 'front');
        await fetch(`/api/inspection/${inspectionId}/image`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: fdScenario
        });
      }

      // 5. Navigate to live analyzing pipeline
      router.push(`/inspections/${inspectionId}/analyzing`);
    } catch (err: any) {
      console.error('Inspection start error:', err);
      setErrorMessage(err.message || 'Could not start inspection');
      setSubmitting(false);
    }
  };


  return (
    <div>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '1rem' }}>
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
          <Camera size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
            New Inspection
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Upload or capture a product image to start the compliance inspection process.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        {/* Left Column: Form Steps */}
        <form onSubmit={handleStartAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Upload Product Package Surfaces */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  1. Upload Package Surfaces
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Upload Front Face and Back Panel for multi-surface Legal Metrology verification.
                </p>
              </div>
              {(frontPreview || backPreview) && (
                <button
                  type="button"
                  onClick={() => {
                    setFrontFile(null);
                    setFrontPreview(null);
                    setBackFile(null);
                    setBackPreview(null);
                    setScenarioId(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All Panels
                </button>
              )}
            </div>

            {/* Hidden Inputs */}
            <input
              type="file"
              ref={frontInputRef}
              onChange={handleFrontChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <input
              type="file"
              ref={backInputRef}
              onChange={handleBackChange}
              style={{ display: 'none' }}
              accept="image/*"
            />

            {/* Dual Dropzone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Panel 1: Front Face (PDP) */}
              <div
                style={{
                  border: frontPreview ? '1px solid #93c5fd' : '2px dashed #cbd5e1',
                  borderRadius: 12,
                  padding: '1.25rem',
                  backgroundColor: frontPreview ? '#f8fafc' : '#fafafa',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: '#eff6ff',
                  color: '#1a6ef5',
                  border: '1px solid #bfdbfe'
                }}>
                  📷 Front Face (PDP)
                </div>

                {frontPreview ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.65rem'
                    }}>
                      <img
                        src={frontPreview}
                        alt="Front panel preview"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={14} color="#16a34a" />
                      <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {frontFile ? frontFile.name : (scenarioId ? `${scenarioId} (Front)` : 'Front Surface Attached')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => frontInputRef.current?.click()}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFrontFile(null);
                          setFrontPreview(null);
                          setScenarioId(null);
                        }}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 4, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => frontInputRef.current?.click()}
                    style={{ textAlign: 'center', cursor: 'pointer', width: '100%', padding: '1rem 0' }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#eff6ff',
                      color: '#1a6ef5',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <UploadCloud size={20} />
                    </div>
                    <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.2rem' }}>
                      Upload Front Panel
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      Brand name, Product name, Net Qty
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); frontInputRef.current?.click(); }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    >
                      <UploadCloud size={14} />
                      Choose Front File
                    </button>
                  </div>
                )}
              </div>

              {/* Panel 2: Back / Information Panel */}
              <div
                style={{
                  border: backPreview ? '1px solid #93c5fd' : '2px dashed #cbd5e1',
                  borderRadius: 12,
                  padding: '1.25rem',
                  backgroundColor: backPreview ? '#f8fafc' : '#fafafa',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  border: '1px solid #ddd6fe'
                }}>
                  📦 Back / Declarations Panel
                </div>

                {backPreview ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.65rem'
                    }}>
                      <img
                        src={backPreview}
                        alt="Back panel preview"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={14} color="#16a34a" />
                      <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {backFile ? backFile.name : 'Back Surface Attached'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => backInputRef.current?.click()}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBackFile(null);
                          setBackPreview(null);
                        }}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 4, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => backInputRef.current?.click()}
                    style={{ textAlign: 'center', cursor: 'pointer', width: '100%', padding: '1rem 0' }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#f5f3ff',
                      color: '#7c3aed',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <UploadCloud size={20} />
                    </div>
                    <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.2rem' }}>
                      Upload Back Panel
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      MRP, Dates, Mfr Address, Helpline
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); backInputRef.current?.click(); }}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                    >
                      <UploadCloud size={14} />
                      Choose Back File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Demo Preloaders */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Or Select Pre-Calibrated SIH Demo Scenario:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleSelectScenario('scenario_1_compliant', 'Britannia Glucose D Biscuits', 'Food & Beverages')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: scenarioId === 'scenario_1_compliant' ? '#16a34a' : '#ecfdf5',
                    color: scenarioId === 'scenario_1_compliant' ? '#ffffff' : '#15803d',
                    border: '1px solid #bbf7d0',
                    cursor: 'pointer'
                  }}
                >
                  Scenario 1: Compliant Biscuit
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectScenario('scenario_2_missing_care', 'Parle-G Glucose Biscuits', 'Food & Beverages')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: scenarioId === 'scenario_2_missing_care' ? '#dc2626' : '#fef2f2',
                    color: scenarioId === 'scenario_2_missing_care' ? '#ffffff' : '#b91c1c',
                    border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}
                >
                  Scenario 2: Missing Care Helpline
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectScenario('scenario_3_low_confidence', 'Fortune Sunlite Sunflower Oil', 'Food & Beverages')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: scenarioId === 'scenario_3_low_confidence' ? '#d97706' : '#fffbeb',
                    color: scenarioId === 'scenario_3_low_confidence' ? '#ffffff' : '#b45309',
                    border: '1px solid #fde68a',
                    cursor: 'pointer'
                  }}
                >
                  Scenario 3: Low OCR Confidence
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              💡 Both panels are analyzed simultaneously by the Qwen 3.8-27B Vision LLM in a single high-speed pass.
            </p>
          </div>

          {/* Step 2: Product Details (Optional) */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              2. Product Details (Optional)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Product Category <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select-field"
                  >
                    <option value="Food & Beverages">🍽️ Food & Beverages</option>
                    <option value="Household Products">🏠 Household Products</option>
                    <option value="Personal Care">🧴 Personal Care</option>
                    <option value="Agricultural Products">🌿 Agricultural Products</option>
                    <option value="Pharmaceuticals">💊 Pharmaceuticals</option>
                    <option value="Others">📦 Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Product Name <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name (e.g., Parle-G Biscuits)"
                  className="input-field"
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                  This will help improve accuracy of extraction.
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Brand <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name (e.g., Parle)"
                  className="input-field"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Additional Notes <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>0/200</span>
                </div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific details about the product..."
                  className="input-field"
                />
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                borderRadius: 8,
                marginTop: '1rem',
                fontSize: '0.84rem'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Blue Info Notice & Action */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #dbeafe',
              borderRadius: 8,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Info size={18} color="#1a6ef5" />
                <span style={{ fontSize: '0.82rem', color: '#1e40af' }}>
                  You can upload multiple images (front, back, sides) for better analysis and accuracy.
                </span>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ padding: '0.65rem 1.5rem', whiteSpace: 'nowrap', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.8 : 1 }}
              >
                {submitting ? 'Initializing Pipeline...' : 'Start Analysis →'}
              </button>
            </div>
          </div>
        </form>


        {/* Right Column: Step Info, Supported Categories, Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: What happens next? */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              What happens next?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              {[
                { num: 1, title: 'Image preprocessing', desc: 'Enhancing image quality and detecting label regions' },
                { num: 2, title: 'OCR extraction', desc: 'Extracting text from the package' },
                { num: 3, title: 'AI information extraction', desc: 'Identifying key declarations (MRP, quantity, manufacturer, etc.)' },
                { num: 4, title: 'Compliance check', desc: 'Evaluating against Legal Metrology rules' },
                { num: 5, title: 'Result & report', desc: 'View compliance score, violations and download report' },
              ].map((step) => (
                <div key={step.num} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#1a6ef5',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{step.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Supported Product Categories */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Supported Product Categories
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      border: isSelected ? '2px solid #1a6ef5' : '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Icon size={18} color={isSelected ? '#1a6ef5' : '#64748b'} />
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: isSelected ? '#1a6ef5' : '#475569',
                      lineHeight: 1.2
                    }}>
                      {cat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Tips for better results */}
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 12,
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Lightbulb size={18} color="#059669" />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#065f46' }}>
                Tips for better results
              </h4>
            </div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#047857', lineHeight: 1.6 }}>
              <li>Use clear, well-lit images</li>
              <li>Include the full label (front and back if possible)</li>
              <li>Avoid blurry or tilted images</li>
              <li>Ensure text is readable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
