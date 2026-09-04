import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface EntityGraphProps {
  rawNodes: Array<{ id: string; label: string; type: string; status?: string; confidence?: number }>;
  rawEdges: Array<{ source: string; target: string; relationship: string; confidence: number; evidence_id?: any }>;
}

export function EntityGraph({ rawNodes, rawEdges }: EntityGraphProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Position nodes in radial / circle layout around center actor node
  const nodes: Node[] = rawNodes.map((n, idx) => {
    const isCenter = idx === 0 || n.type === 'Actor' || n.id === 'ShadowKing';
    let x = 350;
    let y = 250;

    if (!isCenter) {
      const angle = ((idx - 1) / (rawNodes.length - 1)) * 2 * Math.PI;
      const radius = 220;
      x = 350 + radius * Math.cos(angle);
      y = 250 + radius * Math.sin(angle);
    }

    const nodeColor = isCenter
      ? '#ef4444'
      : n.type === 'PGP'
      ? '#38bdf8'
      : n.type === 'Crypto'
      ? '#f97316'
      : n.type === 'Domain'
      ? '#a855f7'
      : '#10b981';

    return {
      id: n.id,
      position: { x, y },
      data: { label: `${n.type}: ${n.label}`, raw: n },
      style: {
        background: '#0f172a',
        color: '#fff',
        border: `2px solid ${nodeColor}`,
        borderRadius: isCenter ? '50%' : '8px',
        padding: '10px 14px',
        fontSize: '12px',
        fontWeight: isCenter ? 'bold' : 'normal',
        width: isCenter ? 120 : 'auto',
        height: isCenter ? 120 : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: `0 0 10px ${nodeColor}44`,
        cursor: 'pointer'
      }
    };
  });

  const edges: Edge[] = rawEdges.map((e, idx) => ({
    id: `e-${idx}`,
    source: e.source,
    target: e.target,
    label: `${e.relationship} (${e.confidence}%)`,
    data: { raw: e },
    style: { stroke: '#38bdf8', strokeWidth: 2 },
    labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 600 }
  }));

  return (
    <div style={{ height: '520px', width: '100%', position: 'relative', background: '#070a11', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => setSelectedItem({ kind: 'Node', data: node.data.raw })}
        onEdgeClick={(_, edge) => setSelectedItem({ kind: 'Relationship', data: edge.data.raw })}
        fitView
      >
        <Background color="#1e293b" gap={16} />
        <Controls style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }} />
      </ReactFlow>

      {selectedItem && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: '#0d1322',
          border: '1px solid #38bdf8',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          maxWidth: '340px',
          zIndex: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>
              {selectedItem.kind} Details
            </strong>
            <button
              onClick={() => setSelectedItem(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {selectedItem.kind === 'Node' ? (
            <div style={{ fontSize: '0.85rem' }}>
              <p><strong>Label:</strong> {selectedItem.data.label || selectedItem.data.id}</p>
              <p><strong>Type:</strong> {selectedItem.data.type}</p>
              {selectedItem.data.status && <p><strong>Status:</strong> {selectedItem.data.status}</p>}
              {selectedItem.data.confidence && <p><strong>Confidence:</strong> {selectedItem.data.confidence}%</p>}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem' }}>
              <p><strong>Relationship:</strong> {selectedItem.data.relationship}</p>
              <p><strong>Between:</strong> {selectedItem.data.source} → {selectedItem.data.target}</p>
              <p><strong>Confidence:</strong> {selectedItem.data.confidence}%</p>
              <p style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                Evidence Record: Correlated via synthetic multi-source dataset.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
