import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Network, Shield, Cpu, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { EntityGraph } from '../components/EntityGraph';

export function InvestigationWorkspacePage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.getInvestigationGraph('INV-001'),
      api.analyzeCorrelation('INV-001')
    ]).then(([gRes, aRes]) => {
      setGraphData(gRes);
      setAnalysis(aRes);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeCorrelation('INV-001');
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !graphData) {
    return <div className="loading-box">Initializing Investigation Workspace...</div>;
  }

  const score = analysis?.confidence_score || 72;
  const level = analysis?.confidence_level || 'HIGH';
  const factors = analysis?.factors || [];

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>INVESTIGATION WORKSPACE</span>
          <h2>Operation ShadowKing De-anonymization (INV-001)</h2>
          <p>Multi-source entity graph correlation, blockchain flow analysis, and explainable scoring.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleRunAnalysis} disabled={analyzing}>
            <Cpu size={16} /> {analyzing ? 'Calculating Score...' : 'Run Correlation Engine'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            <FileText size={16} /> Generate Report
          </button>
        </div>
      </section>

      {/* Grid: Graph on Left, Score Breakdown on Right */}
      <div className="grid grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Network size={18} color="#38bdf8" /> Entity Relationship Graph
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click nodes/edges to inspect evidence</span>
          </div>
          <EntityGraph rawNodes={graphData.nodes || []} rawEdges={graphData.edges || []} />
        </div>

        {/* Right Column: Explainable Confidence Score */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Explainable Score Breakdown</h3>
          <RiskGauge score={score} level={level} />

          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Contributing Score Factors
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {factors.map((f: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#070a11',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '0.65rem 0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#fff' }}>{f.name}</strong>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>+{f.points} pts</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{f.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          color: '#f8fafc',
          fontSize: '0.85rem'
        }}
      >
        <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.25rem' }}>
          INVESTIGATIVE HYPOTHESIS & SAFETY BOUNDARY
        </strong>
        {analysis?.disclaimer || 'All outputs represent investigative hypotheses generated from synthetic test datasets. This platform serves as investigator decision support and does not replace human forensic validation.'}
      </div>
    </div>
  );
}
