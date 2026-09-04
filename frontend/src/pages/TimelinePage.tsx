import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export function TimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTimeline()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-box">Loading Investigation Timeline...</div>;
  }

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>CHRONOLOGICAL RECONSTRUCTION</span>
          <h2>Investigation Activity Timeline (Operation ShadowKing)</h2>
          <p>Time-series activity sequence spanning synthetic dataset indicators.</p>
        </div>
      </section>

      <div className="card">
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '12px', top: '0', bottom: '0', width: '2px', background: '#1e293b' }} />

          {events.map((ev: any, idx: number) => (
            <div key={idx} style={{ position: 'relative', marginBottom: '1.75rem' }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  border: '3px solid #38bdf8',
                  boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)'
                }}
              />

              <div style={{ background: '#070a11', border: '1px solid #1e293b', borderRadius: '6px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }} className="mono">
                    {ev.date}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confidence: {ev.confidence}%</span>
                </div>

                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{ev.event}</strong>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>Source: <strong style={{ color: '#cbd5e1' }}>{ev.source}</strong></span>
                  <span>Indicator: <strong className="mono" style={{ color: '#cbd5e1' }}>{ev.indicator}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
