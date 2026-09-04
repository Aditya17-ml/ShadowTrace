import React from 'react';

export function RiskGauge({ score, level }: { score: number; level: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return '#ef4444';
    if (s >= 60) return '#f97316';
    if (s >= 30) return '#eab308';
    return '#10b981';
  };

  const color = getColor(score);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `8px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: `0 0 16px ${color}33`,
          background: 'var(--bg-card)'
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{score}%</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          CONFIDENCE
        </span>
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color }}>
        {level} CONFIDENCE
      </div>
    </div>
  );
}
