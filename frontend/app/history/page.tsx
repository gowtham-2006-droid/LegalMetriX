'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Plus,
  Calendar,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  MoreVertical,
  Share2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Download
} from 'lucide-react';

interface InspectionItem {
  id: string;
  product_name: string;
  product_category: string;
  status: string;
  created_at: string;
  image_url?: string;
  score?: number;
  status_label?: string;
}

export default function InspectionHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    compliant: 0,
    review: 0,
    nonCompliant: 0
  });

  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<any[]>([]);
  const [loadingDrawer, setLoadingDrawer] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('metrology_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [inspRes, analyticsRes] = await Promise.all([
        fetch('/api/inspections', { headers }),
        fetch('/api/analytics', { headers })
      ]);

      if (inspRes.ok) {
        const data: InspectionItem[] = await inspRes.json();
        setInspections(data);
        if (data.length > 0 && !selectedInspection) {
          selectItem(data[0].id);
        }
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        const sum = aData.summary || {};
        setStats({
          total: sum.total_inspections || 0,
          compliant: sum.compliant_count || 0,
          review: sum.review_count || 0,
          nonCompliant: sum.non_compliant_count || 0
        });
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectItem = async (id: string) => {
    setLoadingDrawer(true);
    try {
      const token = localStorage.getItem('metrology_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [inspRes, compRes] = await Promise.all([
        fetch(`/api/inspection/${id}`, { headers }),
        fetch(`/api/inspection/${id}/compliance`, { headers })
      ]);

      if (inspRes.ok) {
        const item = await inspRes.json();
        setSelectedInspection(item);
      }
      if (compRes.ok) {
        const comp = await compRes.json();
        setSelectedCompliance(comp.results || []);
      }
    } catch (e) {
      console.error('Failed to load item drawer:', e);
    } finally {
      setLoadingDrawer(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const filteredItems = inspections.filter((item) => {
    if (searchQuery && !item.product_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'All Categories') {
      const catNorm = item.product_category.toLowerCase();
      if (!catNorm.includes(categoryFilter.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_'))) {
        return false;
      }
    }
    if (statusFilter !== 'All Status') {
      const st = (item.status_label || item.status || '').toLowerCase();
      if (statusFilter === 'Compliant' && !st.includes('compliant')) return false;
      if (statusFilter === 'Needs Review' && !st.includes('review')) return false;
      if (statusFilter === 'Non-Compliant' && !st.includes('non')) return false;
    }
    return true;
  });

  const totalCount = stats.total || inspections.length || 1;
  const compliantPct = Math.round(((stats.compliant || 0) / totalCount) * 100);
  const reviewPct = Math.round(((stats.review || 0) / totalCount) * 100);
  const nonCompliantPct = Math.round(((stats.nonCompliant || 0) / totalCount) * 100);

  return (
    <div>
      {/* Header */}
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
            <History size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Inspection History
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
              View and manage all your previous inspections. Click on any record to inspect findings.
            </p>
          </div>
        </div>

        <Link href="/inspections/new" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={16} />
          New Inspection
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Query */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <input
              type="text"
              placeholder="Search product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.8rem' }}
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field"
            style={{ minWidth: 150, fontSize: '0.8rem' }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Staples">Staples</option>
            <option value="Edible Oil">Edible Oil</option>
            <option value="Dairy Products">Dairy Products</option>
            <option value="Home Care">Home Care</option>
            <option value="Personal Care">Personal Care</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field"
            style={{ minWidth: 140, fontSize: '0.8rem' }}
          >
            <option value="All Status">All Status</option>
            <option value="Compliant">Compliant</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>

          {/* Reset button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All Categories');
              setStatusFilter('All Status');
            }}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Pills */}
      <div className="grid-4-cols" style={{ marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Total Inspections</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.total || inspections.length}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Compliant</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.compliant}</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>{compliantPct}%</span>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Needs Review</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.review}</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>{reviewPct}%</span>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Non-Compliant</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.nonCompliant}</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>{nonCompliantPct}%</span>
        </div>
      </div>

      {/* Main Split: Table (65%) + Right Details Drawer (35%) */}
      <div className="grid-2-1-cols">
        {/* Left: Table */}
        <div className="card">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={32} className="animate-spin" color="#1a6ef5" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const isSelected = selectedInspection?.id === item.id;
                    const sc = item.score ?? 80;
                    const isComp = sc >= 85;
                    const isWarn = sc >= 60 && sc < 85;
                    const dateStr = item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Recently';

                    return (
                      <tr
                        key={item.id}
                        onClick={() => selectItem(item.id)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? '#eff6ff' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                        <td>
                          <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{item.product_name}</p>
                          <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>{item.id}</p>
                        </td>
                        <td style={{ color: '#475569', textTransform: 'capitalize' }}>
                          {item.product_category.replace(/_/g, ' ')}
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.74rem' }}>{dateStr}</td>
                        <td>
                          <span style={{
                            fontWeight: 800,
                            color: isComp ? '#10b981' : isWarn ? '#f59e0b' : '#ef4444'
                          }}>
                            {Math.round(sc)}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isComp ? 'badge-compliant' : isWarn ? 'badge-review' : 'badge-noncompliant'}`}>
                            {item.status_label || (isComp ? 'Compliant' : 'Needs Review')}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/inspections/${item.id}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Details Drawer */}
        <div className="card" style={{ position: 'sticky', top: 90 }}>
          {loadingDrawer ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={28} className="animate-spin" color="#1a6ef5" />
            </div>
          ) : selectedInspection ? (
            <div>
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedInspection.product_name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    ID: {selectedInspection.id}
                  </p>
                </div>
                <span className={`badge ${
                  (selectedInspection.compliance_score?.weighted_score ?? 80) >= 85
                    ? 'badge-compliant'
                    : 'badge-review'
                }`}>
                  {selectedInspection.compliance_score?.status_label || 'Completed'}
                </span>
              </div>

              {/* Score and Stats */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 8,
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: 0 }}>Score</p>
                  <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    margin: 0,
                    color: (selectedInspection.compliance_score?.weighted_score ?? 80) >= 85 ? '#10b981' : '#f59e0b'
                  }}>
                    {Math.round(selectedInspection.compliance_score?.weighted_score ?? 80)}%
                  </p>
                </div>
                <div style={{ width: 1, height: 35, background: '#e2e8f0' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: 0 }}>Passed</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
                    {selectedInspection.compliance_score?.passed_count ?? 5}
                  </p>
                </div>
                <div style={{ width: 1, height: 35, background: '#e2e8f0' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', color: '#64748b', margin: 0 }}>Failed</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>
                    {selectedInspection.compliance_score?.failed_count ?? 1}
                  </p>
                </div>
              </div>

              {/* Findings list */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Rule Evaluation Findings
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
                  {selectedCompliance.slice(0, 6).map((r, i) => {
                    const isPass = r.status.toLowerCase() === 'pass';
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', paddingBottom: 4 }}>
                        <span style={{ color: '#475569', textTransform: 'capitalize' }}>
                          {r.field.replace(/_/g, ' ')}
                        </span>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: isPass ? '#10b981' : '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.72rem'
                        }}>
                          {isPass ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          {r.detected_value || (isPass ? 'Detected' : 'Missing')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  href={`/inspections/${selectedInspection.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem' }}
                >
                  <Eye size={14} />
                  View Complete Result
                </Link>
                <a
                  href={`/api/inspection/${selectedInspection.id}/report`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
                >
                  <Download size={14} />
                  Download PDF Report
                </a>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Select an inspection to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
