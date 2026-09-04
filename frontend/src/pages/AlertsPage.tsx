import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    setLoading(true);
    api.getAlerts()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateAlertStatus(id, status);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading-box">Loading Investigator Alert Queue...</div>;
  }

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>ALERT DISPATCH QUEUE</span>
          <h2>Automated Correlation Alerts</h2>
          <p>Real-time notifications generated when new synthetic entity correlations exceed threshold.</p>
        </div>
      </section>

      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} color="#f97316" /> Active Alert Stream ({alerts.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map((al: any) => (
            <div
              key={al.id}
              style={{
                background: '#070a11',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <Badge t={al.severity} />
                  <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{al.title || al.description}</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{al.description}</p>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Target: <strong style={{ color: '#cbd5e1' }}>{al.actor || 'ShadowKing'}</strong> | Status: <span className="mono" style={{ color: '#38bdf8' }}>{al.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => handleUpdateStatus(al.id, 'REVIEWING')}
                >
                  Review
                </button>
                <button
                  className="btn-primary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => handleUpdateStatus(al.id, 'CONFIRMED')}
                >
                  Confirm
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}
                  onClick={() => handleUpdateStatus(al.id, 'DISMISSED')}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
