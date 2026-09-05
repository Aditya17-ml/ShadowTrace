import React, { useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Shield, Key, Wallet, Globe, Mail, FileText, Cpu, CheckCircle } from 'lucide-react';
import { Badge } from './Badge';

interface EntityGraphProps {
  rawNodes: Array<{ id: string; label: string; type: string; status?: string; confidence?: number }>;
  rawEdges: Array<{ source: string; target: string; relationship: string; confidence: number; evidence_id?: any }>;
}

export function EntityGraph({ rawNodes, rawEdges }: EntityGraphProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  // Filter nodes based on selected type & search query
  const filteredRawNodes = useMemo(() => {
    return rawNodes.filter((n) => {
      const matchesType = filterType === 'ALL' || n.type.toUpperCase() === filterType.toUpperCase();
      const matchesSearch = !searchQuery.trim() ||
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [rawNodes, filterType, searchQuery]);

  const activeNodeIds = useMemo(() => new Set(filteredRawNodes.map((n) => n.id)), [filteredRawNodes]);

  // Filter edges where both source and target exist in active filtered nodes
  const filteredRawEdges = useMemo(() => {
    return rawEdges.filter((e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target));
  }, [rawEdges, activeNodeIds]);

  // Map nodes to React Flow nodes with vibrant dark theme colors & radial layout
  const nodes: Node[] = useMemo(() => {
    return filteredRawNodes.map((n, idx) => {
      const isCenter = idx === 0 || n.type === 'Actor' || n.id === 'ShadowKing';
      let x = 400;
      let y = 280;

      if (!isCenter) {
        const count = Math.max(filteredRawNodes.length - 1, 1);
        const angle = ((idx - 1) / count) * 2 * Math.PI;
        const radius = 240;
        x = 400 + radius * Math.cos(angle);
        y = 280 + radius * Math.sin(angle);
      }

      const nodeColor = isCenter
        ? '#ef4444' // Red for Threat Actor
        : n.type === 'PGP'
        ? '#38bdf8' // Electric Blue for PGP
        : n.type === 'Crypto'
        ? '#f97316' // Orange for Crypto
        : n.type === 'Domain'
        ? '#a855f7' // Purple for Domain
        : n.type === 'Email' || n.type === 'Username'
        ? '#10b981' // Green for Handles/Email
        : '#eab308'; // Amber for Doc/IP

      return {
        id: n.id,
        position: { x, y },
        data: { label: `${n.type}: ${n.label}`, raw: n },
        style: {
          background: isCenter ? 'radial-gradient(circle, #1e1b4b 0%, #0f172a 100%)' : '#0d1322',
          color: '#fff',
          border: `2px solid ${nodeColor}`,
          borderRadius: isCenter ? '50%' : '8px',
          padding: isCenter ? '20px' : '10px 14px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: isCenter ? 700 : 500,
          width: isCenter ? 130 : 'auto',
          height: isCenter ? 130 : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: `0 0 16px ${nodeColor}55`,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }
      };
    });
  }, [filteredRawNodes]);

  const edges: Edge[] = useMemo(() => {
    return filteredRawEdges.map((e, idx) => ({
      id: `e-${idx}`,
      source: e.source,
      target: e.target,
      label: `${e.relationship} (${e.confidence}%)`,
      data: { raw: e },
      style: { stroke: '#38bdf8', strokeWidth: 2, opacity: 0.85 },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600, fontFamily: 'JetBrains Mono' }
    }));
  }, [filteredRawEdges]);

  const categoryTypes = ['ALL', 'Actor', 'Username', 'Email', 'PGP', 'Crypto', 'Domain', 'Document', 'IP'];

  return (
    <div style={{ height: '620px', width: '100%', position: 'relative', background: '#070a11', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Interactive Controls Toolbar */}
      <div style={{ padding: '0.75rem 1rem', background: '#0b0f19', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {categoryTypes.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              style={{
                background: filterType.toUpperCase() === cat.toUpperCase() ? 'rgba(56, 189, 248, 0.2)' : '#070a11',
                color: filterType.toUpperCase() === cat.toUpperCase() ? '#38bdf8' : '#94a3b8',
                border: `1px solid ${filterType.toUpperCase() === cat.toUpperCase() ? '#38bdf8' : '#1e293b'}`,
                borderRadius: '4px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search Input & Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#070a11', border: '1px solid #1e293b', borderRadius: '4px', padding: '0.25rem 0.6rem' }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Highlight node..."
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.75rem', marginLeft: '0.4rem', outline: 'none', width: '130px' }}
            />
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Nodes: <strong style={{ color: '#38bdf8' }}>{nodes.length}</strong> | Edges: <strong style={{ color: '#38bdf8' }}>{edges.length}</strong>
          </div>
        </div>
      </div>

      {/* Main React Flow Graph Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => setSelectedItem({ kind: 'Node', data: node.data.raw })}
          onEdgeClick={(_, edge) => setSelectedItem({ kind: 'Relationship', data: edge.data.raw })}
          fitView
        >
          <Background color="#1e293b" gap={18} size={1} />
          <Controls style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b', borderRadius: '6px' }} />
          <MiniMap nodeColor="#38bdf8" maskColor="rgba(7, 10, 17, 0.8)" style={{ background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '6px' }} />
        </ReactFlow>

        {/* Selected Entity / Edge Inspector Drawer */}
        {selectedItem && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: '#0d1322',
            border: '1px solid #38bdf8',
            borderRadius: '8px',
            padding: '1.25rem',
            width: '350px',
            zIndex: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.85)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={16} /> Forensic Inspector ({selectedItem.kind})
              </strong>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {selectedItem.kind === 'Node' ? (
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>ENTITY VALUE</span>
                  <div className="mono" style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-all' }}>
                    {selectedItem.data.label || selectedItem.data.id}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Type: <strong style={{ color: '#38bdf8' }}>{selectedItem.data.type}</strong></span>
                  <Badge t={selectedItem.data.status || 'CORRELATED'} />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Confidence Score:</span>
                  <div style={{ background: '#070a11', borderRadius: '4px', height: '8px', overflow: 'hidden', marginTop: '0.25rem' }}>
                    <div style={{ width: `${selectedItem.data.confidence || 82}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'block', textAlign: 'right', marginTop: '0.15rem' }}>
                    {selectedItem.data.confidence || 82}%
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedItem.data.type === 'Crypto' && (
                    <button className="btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', flex: 1 }} onClick={() => navigate('/blockchain')}>
                      <Wallet size={14} /> Open Blockchain View
                    </button>
                  )}
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', flex: 1 }} onClick={() => navigate('/evidence')}>
                    <FileText size={14} /> View Evidence Record
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>RELATIONSHIP LINK</span>
                  <strong style={{ color: '#fff', display: 'block', marginTop: '0.15rem' }}>
                    {selectedItem.data.relationship}
                  </strong>
                </div>

                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>LINKED NODES</span>
                  <div className="mono" style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                    {selectedItem.data.source} <span style={{ color: '#94a3b8' }}>→</span> {selectedItem.data.target}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>RELATIONSHIP CONFIDENCE</span>
                  <div style={{ background: '#070a11', borderRadius: '4px', height: '8px', overflow: 'hidden', marginTop: '0.25rem' }}>
                    <div style={{ width: `${selectedItem.data.confidence}%`, height: '100%', background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'block', textAlign: 'right', marginTop: '0.15rem' }}>
                    {selectedItem.data.confidence}%
                  </span>
                </div>

                <p style={{ marginTop: '0.25rem', color: '#94a3b8', fontSize: '0.75rem', lineHeight: '1.4' }}>
                  Supported by synthetic multi-source cross-reference log #EV-00123.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
