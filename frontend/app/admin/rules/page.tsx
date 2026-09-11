'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Search,
  Plus,
  CheckCircle2,
  FileText,
  Layers,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  Edit3,
  ExternalLink,
  Ban,
  Save,
  AlertTriangle,
  X,
  ArrowLeft,
  Check
} from 'lucide-react';
import Link from 'next/link';

interface Rule {
  id: string;
  requirement: string;
  categories: string;
  severity: 'High' | 'Medium' | 'Low';
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Conditional' | 'Draft';
  source: string;
  logic: string;
  fields: string[];
  exceptions: string;
  effectiveDate: string;
  reviewDate: string;
}

const mockRules: Rule[] = [
  {
    id: 'LM-001',
    requirement: 'MRP Declaration',
    categories: 'Food, Beverages, Household',
    severity: 'High',
    version: 'v1.4',
    lastUpdated: '11 Sep 2026',
    status: 'Active',
    source: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(e)',
    logic: 'Detect Maximum Retail Price with "MRP Rs." or "₹" inclusive of all taxes. Flag if absent, multi-printed, or illegible.',
    fields: ['MRP value in INR', 'Inclusive of all taxes text', 'Unit sale price'],
    exceptions: 'Exempted for specific agricultural raw produce loose packs.',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  },
  {
    id: 'LM-002',
    requirement: 'Net Quantity',
    categories: 'Food, Beverages, Household',
    severity: 'High',
    version: 'v1.3',
    lastUpdated: '10 Sep 2026',
    status: 'Active',
    source: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(c)',
    logic: 'Check declaration of net quantity in standard metric units (g, kg, ml, l, or pcs). Verify minimum font size based on volume/weight tier.',
    fields: ['Net weight/volume numeral', 'Standard unit symbol', 'Font size height verification'],
    exceptions: 'Packs below 10g/10ml where exemption applies under Rule 26.',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  },
  {
    id: 'LM-003',
    requirement: 'Manufacturer Details',
    categories: 'Food, Beverages, Household',
    severity: 'High',
    version: 'v1.2',
    lastUpdated: '09 Sep 2026',
    status: 'Active',
    source: 'Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(a)',
    logic: 'Name and complete address of the manufacturer, packer, or importer must be prominently printed.',
    fields: ['Company/Entity Name', 'Complete Postal Address', 'PIN / Zip Code'],
    exceptions: 'None. Mandatory for all pre-packaged commodities.',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  },
  {
    id: 'LM-004',
    requirement: 'Consumer Care Information',
    categories: 'Food, Household',
    severity: 'High',
    version: 'v1.2',
    lastUpdated: '10 Sep 2026',
    status: 'Active',
    source: 'Legal Metrology (Packaged Commodities) Rules, 2011 + applicable amendments',
    logic: 'Check for presence of consumer-care information (contact number, email, postal address) in the package text using OCR and NLP extraction. If not found, mark as non-compliant.',
    fields: ['Consumer care phone number', 'Consumer care email ID', 'Postal address'],
    exceptions: 'Not applicable for certain categories as per regulation (exact list to be maintained).',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  },
  {
    id: 'LM-005',
    requirement: 'Best Before / Use By',
    categories: 'Food, Beverages',
    severity: 'Medium',
    version: 'v1.1',
    lastUpdated: '08 Sep 2026',
    status: 'Conditional',
    source: 'Rule 6(1)(d) & FSSAI Packaging & Labelling Regulations',
    logic: 'Verify date of manufacture/packaging and Best Before or Expiry date in Month/Year or Day/Month/Year format.',
    fields: ['Mfg date', 'Expiry / Best Before date', 'Format compliance'],
    exceptions: 'Not mandatory for non-perishable consumer durables & industrial commodities.',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  },
  {
    id: 'LM-006',
    requirement: 'Country of Origin',
    categories: 'Food, Beverages, Household',
    severity: 'Medium',
    version: 'v1.1',
    lastUpdated: '07 Sep 2026',
    status: 'Conditional',
    source: 'Legal Metrology (Packaged Commodities) Amendment Rules 2017 & 2020',
    logic: 'Declaration of country of origin or manufacture on imported and domestic goods.',
    fields: ['Country Name', 'Made in / Assembled in declaration'],
    exceptions: 'Indigenous goods clearly manufactured in India with complete local address.',
    effectiveDate: '01 Jan 2022',
    reviewDate: '01 Jan 2027'
  }
];

export default function LegalMetrologyRulesPage() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<Rule>(mockRules[3]); // Default LM-004 as in screenshot
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rules');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Rule[] = data.map((r: any) => ({
            id: r.rule_id,
            requirement: r.requirement || r.rule_name,
            categories: r.applicable_category === 'all_packaged_food' ? 'Food, Beverages' : r.applicable_category,
            severity: (r.severity === 'Critical' ? 'High' : r.severity) as any,
            version: r.version.startsWith('v') ? r.version : `v${r.version}`,
            lastUpdated: '11 Sep 2026',
            status: r.is_active ? 'Active' : 'Draft',
            source: r.source_reference || 'Legal Metrology (Packaged Commodities) Rules, 2011',
            logic: typeof r.validation_logic === 'string' ? r.validation_logic : (r.explanation_template || JSON.stringify(r.validation_logic)),
            fields: ['Consumer care phone number', 'Consumer care email ID', 'Postal address'],
            exceptions: 'Not applicable for certain categories as per regulation.',
            effectiveDate: '01 Jan 2022',
            reviewDate: '01 Jan 2027'
          }));
          setRules(mapped);
          setSelectedRule((prev) => {
            const found = mapped.find((m) => m.id === prev?.id);
            return found || mapped[3] || mapped[0];
          });
        }
      }
    } catch (e) {
      console.error('Failed to fetch rules:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRule?.id) {
      fetchHistory(selectedRule.id);
    }
  }, [selectedRule?.id]);

  const fetchHistory = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/rules/${ruleId}/history`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setHistoryList(data);
      }
    } catch (e) {}
  };

  const handleToggleRule = async () => {
    if (!selectedRule) return;
    setToggleLoading(true);
    try {
      const token = localStorage.getItem('metrology_token');
      const res = await fetch(`/api/rules/${selectedRule.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (res.ok) {
        await fetchRules();
      }
    } catch (e) {
      console.error('Failed to toggle rule:', e);
    } finally {
      setToggleLoading(false);
    }
  };

  const filteredRules = rules.filter((r) => {
    const matchQuery =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requirement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === 'All Categories' || r.categories.includes(selectedCategory);
    const matchStatus = selectedStatus === 'All Status' || r.status === selectedStatus;
    return matchQuery && matchCategory && matchStatus;
  });


  return (
    <div style={{ display: 'flex', gap: '20px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Main Table Column */}
      <div style={{ flex: drawerOpen ? '1 1 60%' : '1 1 100%', minWidth: 0 }}>
        {/* Header with Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#2563eb'
              }}
            >
              <ArrowLeft size={18} />
            </Link>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Scale size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Legal Metrology Rules
              </h1>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Manage, version, and audit compliance rules used by the inspection engine.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              flex: '1 1 200px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search rules..."
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

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '9px 14px',
              fontSize: '0.85rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option>All Categories</option>
            <option>Food</option>
            <option>Beverages</option>
            <option>Household</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '9px 14px',
              fontSize: '0.85rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Conditional</option>
            <option>Draft</option>
          </select>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              backgroundColor: '#1a6ef5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>Add Rule</span>
          </button>
        </div>

        {/* 4 Summary Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Active Rules</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {rules.filter((r) => r.status === 'Active').length}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Draft Rules</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {rules.filter((r) => r.status !== 'Active').length}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#f5f3ff',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Categories</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {new Set(rules.map((r) => r.categories.split(',')[0].trim())).size}
              </div>
            </div>
          </div>


          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Last Updated</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>11 Sep 2026</div>
            </div>
          </div>
        </div>

        {/* Legal Metrology Rules Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginBottom: '20px'
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Legal Metrology Rules
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', width: '32px' }}>#</th>
                  <th style={{ padding: '12px 14px' }}>Rule ID</th>
                  <th style={{ padding: '12px 14px' }}>Requirement</th>
                  <th style={{ padding: '12px 14px' }}>Applicable Categories</th>
                  <th style={{ padding: '12px 14px' }}>Severity</th>
                  <th style={{ padding: '12px 14px' }}>Version</th>
                  <th style={{ padding: '12px 14px' }}>Last Updated</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule, idx) => {
                  const isSelected = selectedRule.id === rule.id;
                  return (
                    <tr
                      key={rule.id}
                      onClick={() => {
                        setSelectedRule(rule);
                        setDrawerOpen(true);
                      }}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a6ef5' }}>{rule.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{rule.requirement}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{rule.categories}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: rule.severity === 'High' ? '#fee2e2' : '#fef3c7',
                            color: rule.severity === 'High' ? '#dc2626' : '#d97706'
                          }}
                        >
                          {rule.severity}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{rule.version}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{rule.lastUpdated}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: rule.status === 'Active' ? '#dcfce7' : '#fef3c7',
                            color: rule.status === 'Active' ? '#16a34a' : '#d97706'
                          }}
                        >
                          {rule.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: '#94a3b8' }}>
                        <MoreVertical size={16} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.8rem',
              color: '#64748b'
            }}
          >
            <span>Showing 1 to 6 of 24 rules</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#1a6ef5',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                1
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                2
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                3
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                4
              </button>
              <button
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={14} />
              </button>

              <span style={{ marginLeft: '14px' }}>Rows per page:</span>
              <select
                defaultValue="10"
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  fontSize: '0.8rem',
                  color: '#334155'
                }}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Split: Rule Version History & Audit Trail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Rule Version History */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px 20px'
            }}
          >
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Rule Version History
            </h3>
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              {/* Vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '6px',
                  bottom: '6px',
                  width: '2px',
                  backgroundColor: '#e2e8f0'
                }}
              />

              {/* Version 1.2 Current */}
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid #ffffff'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#10b981' }}>v1.2</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}
                  >
                    Current
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 'auto' }}>10 Sep 2026</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Updated detection logic and added exceptions for specific product categories.
                </p>
              </div>

              {/* Version 1.1 */}
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    border: '2px solid #ffffff'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2563eb' }}>v1.1</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 'auto' }}>08 Sep 2026</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Added category mapping and improved rule description.
                </p>
              </div>

              {/* Version 1.0 */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#94a3b8',
                    border: '2px solid #ffffff'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#475569' }}>v1.0</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 'auto' }}>05 Sep 2026</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Initial version of the rule.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Clock size={16} style={{ color: '#2563eb' }} />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Audit Trail
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#64748b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  I
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Inspector-01</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>10 Sep 2026, 11:24 AM</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Updated rule logic and categories.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#475569',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  A
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Admin-01</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>08 Sep 2026, 04:15 PM</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Modified severity level.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#475569',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  A
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Admin-01</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>05 Sep 2026, 10:32 AM</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Created the rule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Details Drawer */}
      {drawerOpen && (
        <div
          style={{
            flex: '0 0 380px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#2563eb' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Rule Details
              </h2>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Rule Title & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedRule.id}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                  {selectedRule.status}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} />
                Official source verified
              </div>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
              {selectedRule.requirement}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Consumer-care information must be declared where applicable for the product.
            </p>
          </div>

          {/* Key Attributes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Applicable Categories</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Food / Household</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Severity</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626'
                }}
              >
                {selectedRule.severity}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Status</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#dcfce7',
                  color: '#16a34a'
                }}
              >
                {selectedRule.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Version</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedRule.version}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Last Updated</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>10 Sep 2026, 11:24 AM</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Source</span>
              <span style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                {selectedRule.source}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <span style={{ color: '#64748b' }}>Rule Logic</span>
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  lineHeight: 1.4
                }}
              >
                {selectedRule.logic}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Detection Fields</span>
              <ul style={{ margin: 0, paddingLeft: '16px', color: '#334155' }}>
                {selectedRule.fields.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#64748b' }}>Exceptions</span>
              <span style={{ color: '#334155', lineHeight: 1.3 }}>{selectedRule.exceptions}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Effective Date</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedRule.effectiveDate}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Review Date</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedRule.reviewDate}</span>
            </div>
          </div>

          {/* Warning Banner */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#b45309',
              fontSize: '0.74rem'
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>Rules must be reviewed against current official notifications before activation.</span>
          </div>

          {/* Drawer Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #2563eb',
                  color: '#2563eb',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} />
                Edit Rule
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={14} />
                View Source
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={handleToggleRule}
                disabled={toggleLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  border: selectedRule.status === 'Active' ? '1px solid #ef4444' : '1px solid #16a34a',
                  color: selectedRule.status === 'Active' ? '#ef4444' : '#16a34a',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {selectedRule.status === 'Active' ? <Ban size={14} /> : <Check size={14} />}
                {toggleLoading ? 'Updating...' : (selectedRule.status === 'Active' ? 'Disable Rule' : 'Enable Rule')}
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: '#1a6ef5',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
