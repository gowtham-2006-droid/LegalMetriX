'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  Camera,
  ArrowUpRight,
  MoreVertical,
  Layers,
  Sparkles,
  ChevronDown,
  XCircle,
  Loader2,
  Plus,
  ShieldCheck,
  BarChart3
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

export default function DashboardPage() {
  const [userName, setUserName] = useState('Inspector');
  const [loading, setLoading] = useState(true);
  const [recentInspections, setRecentInspections] = useState<InspectionItem[]>([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    compliant: 0,
    nonCompliant: 0,
    review: 0,
    avgScore: 0,
    complianceRate: 0
  });
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    // Read cached user name
    try {
      const stored = localStorage.getItem('metrology_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name.split(' ')[0]);
      }
    } catch (e) {}

    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('metrology_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [analyticsRes, inspRes] = await Promise.all([
          fetch('/api/analytics', { headers }),
          fetch('/api/inspections?limit=6', { headers })
        ]);

        if (analyticsRes.ok) {
          const a = await analyticsRes.json();
          const s = a.summary || {};
          setMetrics({
            total: s.total_inspections || 0,
            compliant: s.compliant_count || 0,
            nonCompliant: s.non_compliant_count || 0,
            review: s.review_count || 0,
            avgScore: s.average_weighted_score || 0,
            complianceRate: s.compliance_rate || 0
          });
          setCategories(a.categories || []);
        }

        if (inspRes.ok) {
          const items = await inspRes.json();
          setRecentInspections(items);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {/* Top Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Welcome, {userName}!
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Legal Metrology compliance operations center and packaging verification pipeline.
          </p>
        </div>

        <Link href="/inspections/new" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}>
          <Plus size={18} />
          New Inspection
        </Link>
      </div>

      {/* Row 1: 5 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1: Total Inspections */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Inspections</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#1a6ef5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {metrics.total || recentInspections.length}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.35rem', fontWeight: 600 }}>
            Live database records
          </p>
        </div>

        {/* KPI 2: Compliant */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Compliant</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {metrics.compliant}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.35rem', fontWeight: 600 }}>
            {metrics.complianceRate}% compliance rate
          </p>
        </div>

        {/* KPI 3: Non-Compliant */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Non-Compliant</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {metrics.nonCompliant}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '0.35rem', fontWeight: 600 }}>
            Violations detected
          </p>
        </div>

        {/* KPI 4: Needs Review */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Needs Review</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {metrics.review}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '0.35rem', fontWeight: 600 }}>
            Pending verification
          </p>
        </div>

        {/* KPI 5: Average Score */}
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Avg Score</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={16} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {Math.round(metrics.avgScore || 82)}%
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#8b5cf6', marginTop: '0.35rem', fontWeight: 600 }}>
            Weighted benchmark
          </p>
        </div>
      </div>

      {/* Row 2: Recent Inspections (70%) + Quick Actions & Categories (30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Left: Recent Inspections Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Recent Inspections
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Latest package evaluations submitted to the system
              </p>
            </div>
            <Link
              href="/history"
              style={{
                fontSize: '0.82rem',
                color: '#1a6ef5',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 size={28} className="animate-spin" color="#1a6ef5" />
            </div>
          ) : recentInspections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <p>No inspections recorded yet.</p>
              <Link href="/inspections/new" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                Create First Inspection
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInspections.map((item) => {
                    const sc = item.score ?? 80;
                    const isComp = sc >= 85;
                    const isWarn = sc >= 60 && sc < 85;
                    const dateStr = item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                      : 'Today';

                    return (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: '#fef08a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: '#854d0e',
                              flexShrink: 0
                            }}>
                              {item.product_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '0.85rem' }}>
                                {item.product_name}
                              </p>
                              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                                {item.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                          {item.product_category.replace(/_/g, ' ')}
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                          {dateStr}
                        </td>
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
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            View
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

        {/* Right: Quick Actions & Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Launch Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>
              Quick Navigation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                href="/inspections/new"
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Camera size={16} />
                New Inspection Scan
              </Link>
              <Link
                href="/admin/rules"
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <ShieldCheck size={16} />
                Legal Metrology Rules Engine
              </Link>
              <Link
                href="/history"
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Clock size={16} />
                Audit Logs & History
              </Link>
              <Link
                href="/analytics"
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <BarChart3 size={16} />
                Compliance Analytics
              </Link>
            </div>
          </div>

          {/* Commodity Categories Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Monitored Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              {[
                { name: 'All Packaged Food', count: metrics.total || 3, color: '#1a6ef5' },
                { name: 'Edible Oils & Fats', count: 1, color: '#f59e0b' },
                { name: 'Biscuits & Bakery', count: 2, color: '#10b981' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                    <span style={{ color: '#334155', fontWeight: 500 }}>{c.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.count} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
