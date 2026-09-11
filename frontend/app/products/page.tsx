'use client';

import React, { useState } from 'react';
import { Database, Search, Plus, Filter, CheckCircle, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  mrp: string;
  netQty: string;
  status: 'Compliant' | 'Needs Review' | 'Non-Compliant';
  inspectionsCount: number;
  lastInspected: string;
}

const mockProducts: ProductItem[] = [
  {
    id: 'PRD-001',
    name: 'Parle-G Glucose Biscuits',
    brand: 'Parle Products Pvt Ltd',
    category: 'Biscuits & Cookies',
    mrp: '₹10.00',
    netQty: '130 g',
    status: 'Non-Compliant',
    inspectionsCount: 124,
    lastInspected: '11 Sep 2026'
  },
  {
    id: 'PRD-002',
    name: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestle India Limited',
    category: 'Instant Food',
    mrp: '₹14.00',
    netQty: '70 g',
    status: 'Compliant',
    inspectionsCount: 98,
    lastInspected: '11 Sep 2026'
  },
  {
    id: 'PRD-003',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Adani Wilmar Limited',
    category: 'Edible Oils',
    mrp: '₹145.00',
    netQty: '1 L',
    status: 'Needs Review',
    inspectionsCount: 76,
    lastInspected: '10 Sep 2026'
  },
  {
    id: 'PRD-004',
    name: 'Aashirvaad Superior MP Atta',
    brand: 'ITC Limited',
    category: 'Flour & Grains',
    mrp: '₹245.00',
    netQty: '5 kg',
    status: 'Compliant',
    inspectionsCount: 64,
    lastInspected: '09 Sep 2026'
  },
  {
    id: 'PRD-005',
    name: 'Tata Salt Vacuum Evaporated',
    brand: 'Tata Consumer Products Ltd',
    category: 'Spices & Condiments',
    mrp: '₹28.00',
    netQty: '1 kg',
    status: 'Compliant',
    inspectionsCount: 48,
    lastInspected: '08 Sep 2026'
  }
];

export default function ProductsDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Database size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Products Database
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Master registry of pre-packaged commodities surveyed under Legal Metrology enforcement.
            </p>
          </div>
        </div>

        <Link
          href="/inspections/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a6ef5',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <Plus size={16} />
          New Inspection
        </Link>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: '1', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search commodities by brand, product name, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              fontSize: '0.85rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Products Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Product ID</th>
                <th style={{ padding: '12px 16px' }}>Product Details</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Declared Net Qty</th>
                <th style={{ padding: '12px 16px' }}>MRP</th>
                <th style={{ padding: '12px 16px' }}>Enforcement Status</th>
                <th style={{ padding: '12px 16px' }}>Inspections</th>
                <th style={{ padding: '12px 16px' }}>Last Audited</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1a6ef5' }}>{item.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.brand}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{item.category}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600 }}>{item.netQty}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>{item.mrp}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor:
                          item.status === 'Compliant'
                            ? '#dcfce7'
                            : item.status === 'Needs Review'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          item.status === 'Compliant'
                            ? '#16a34a'
                            : item.status === 'Needs Review'
                            ? '#d97706'
                            : '#dc2626'
                      }}
                    >
                      {item.status === 'Compliant' ? (
                        <CheckCircle size={12} />
                      ) : item.status === 'Needs Review' ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: 600 }}>
                    {item.inspectionsCount}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.lastInspected}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Link
                      href="/inspections/new"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#1a6ef5',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      Inspect
                      <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
