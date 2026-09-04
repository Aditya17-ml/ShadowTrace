import React, { useEffect, useState } from 'react';
import { Network, Info } from 'lucide-react';
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
    return <div className="loading-box">Loading Entity Relationship Graph...</div>;
  }

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>GRAPH ANALYTICS</span>
          <h2>Multi-Source Threat Actor Entity Relationship Graph</h2>
          <p>Visualizing linked synthetic PGP fingerprints, darknet domains, BTC addresses, and forum handles.</p>
        </div>
      </section>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network size={18} color="#38bdf8" /> Full Network Topology (INV-001)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {data.nodes?.length || 0} Nodes | {data.edges?.length || 0} Edges
          </span>
        </div>

        <EntityGraph rawNodes={data.nodes || []} rawEdges={data.edges || []} />
      </div>
    </div>
  );
}
