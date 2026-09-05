import React, { useEffect, useState } from 'react';
import { Network, Cpu, Shield, Key, Wallet, Globe, Mail, FileText, Info } from 'lucide-react';
import { api } from '../services/api';
import { EntityGraph } from '../components/EntityGraph';

export function EntityGraphPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvestigationGraph('INV-001')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="loading-box">Loading Multi-Source Entity Relationship Graph...</div>;
  }

  const nodesList = data.nodes || [];
  const edgesList = data.edges || [];

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>GRAPH INTELLIGENCE ANALYTICS</span>
          <h2>Multi-Source Threat Actor Entity Relationship Graph</h2>
          <p>Interactive graph topology mapping linked PGP fingerprints, onion domains, BTC addresses, and handles for NTRO.</p>
        </div>
      </section>

      {/* Network Metrics Bar */}
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.65rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px', color: '#38bdf8' }}>
            <Network size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL ENTITY NODES</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{nodesList.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: '#10b981' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>RELATIONSHIP EDGES</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{edgesList.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.65rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '6px', color: '#f97316' }}>
            <Key size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>PGP REUSE LINK</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>91% Conf.</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', marginBottom: 0 }}>
          <div style={{ padding: '0.65rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px', color: '#a855f7' }}>
            <Globe size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>INFRASTRUCTURE OVERLAP</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>darkshop.onion</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph View */}
      <div className="card" style={{ padding: '1rem' }}>
        <EntityGraph rawNodes={nodesList} rawEdges={edgesList} />
      </div>

      {/* Category Legend Bar */}
      <div className="card">
        <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Entity Type Legend & Neon Identifiers</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px #ef4444' }} />
            <strong style={{ color: '#fff' }}>Threat Actor Node</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block', boxShadow: '0 0 6px #38bdf8' }} />
            <strong style={{ color: '#fff' }}>PGP Fingerprint</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316', display: 'inline-block', boxShadow: '0 0 6px #f97316' }} />
            <strong style={{ color: '#fff' }}>Crypto Wallet</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7', display: 'inline-block', boxShadow: '0 0 6px #a855f7' }} />
            <strong style={{ color: '#fff' }}>Darkweb Onion Service</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
            <strong style={{ color: '#fff' }}>Username / Email Handle</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
