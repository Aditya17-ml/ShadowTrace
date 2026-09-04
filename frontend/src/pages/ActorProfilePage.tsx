import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Play, CheckCircle, Network, Cpu, Info } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { RiskGauge } from '../components/RiskGauge';

export function ActorProfilePage() {
  const [searchParams] = useSearchParams();
  const actorId = searchParams.get('id') || '1';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getActorDetail(actorId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [actorId]);

  if (loading || !data) {
    return <div className="loading-box">Loading Threat Actor Profile...</div>;
  }

  const actor = data.actor || {};
  const entities = data.entities || [];

  return (
    <div>
      {/* Banner */}
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>
            THREAT ACTOR DOSSIER (CODE: {actor.actor_code || 'ACTOR-001'})
          </span>
          <h2>{actor.name}</h2>
          <p>Status: <strong>{actor.status}</strong> | Risk Level: <Badge t={actor.risk || 'HIGH'} /></p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/investigation')}>
          <Play size={16} /> Open Investigation Workspace
        </button>
      </section>

      {/* Main Grid */}
      <div className="grid grid-3">
        {/* Left Col: Confidence Gauge & Aliases */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Explainable Risk Assessment</h3>
          <RiskGauge score={actor.confidence || 72} level={actor.risk || 'HIGH'} />

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Identified Aliases</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(actor.aliases || ['shadowking', 'alpha_1337', 'forum_user_xyz']).map((a: string, i: number) => (
                <span
                  key={i}
                  className="mono"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Col: Associated Entities */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Associated Synthetic Entities ({entities.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {entities.map((e: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: '#070a11',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>
                    {e.type}
                  </span>
                  <strong className="mono" style={{ fontSize: '0.85rem', color: '#fff' }}>
                    {e.value}
                  </strong>
                </div>
                <Badge t={e.status} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} /> Automated AI Synthetic Intelligence Synthesis
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              {data.aiAnalysis || 'Analysis suggests that the synthetic handles shadowking, alpha_1337 and forum_user_xyz represent the same online persona based on PGP key reuse and multi-hop transaction routing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Legend */}
      <div className="card">
        <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
          Investigator Decision-Support Classification Legend
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.8rem' }}>
          <div style={{ background: '#070a11', padding: '0.6rem', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#10b981' }}>OBSERVED</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Directly present in raw dataset.</p>
          </div>
          <div style={{ background: '#070a11', padding: '0.6rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
            <strong style={{ color: '#38bdf8' }}>CORRELATED</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Supported by 2+ indicators.</p>
          </div>
          <div style={{ background: '#070a11', padding: '0.6rem', borderRadius: '4px', borderLeft: '3px solid #f97316' }}>
            <strong style={{ color: '#f97316' }}>INFERRED</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Derived by scoring engine.</p>
          </div>
          <div style={{ background: '#070a11', padding: '0.6rem', borderRadius: '4px', borderLeft: '3px solid #94a3b8' }}>
            <strong style={{ color: '#94a3b8' }}>UNVERIFIED</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Requires analyst validation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
