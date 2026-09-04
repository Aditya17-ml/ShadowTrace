import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, AlertTriangle, Shield, Activity, Wallet, Network } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Badge } from '../components/Badge';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="loading-box">Loading SOC Dashboard Console...</div>;
  }

  const kpis = data.kpis || {};

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.05em' }}>
            ACTIVE SYNTHETIC INVESTIGATION
          </span>
          <h2>ShadowKing (ACTOR-001)</h2>
          <p>Evidence-driven multi-source correlation & threat actor decision support for NTRO.</p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/actor?id=A-001')}>
          <Play size={16} /> Load Demo Investigation
        </button>
      </section>

      {/* KPI Row */}
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: '#38bdf8' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>DARK WEB SOURCES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.darkWebSources}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>THREAT ACTORS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.threatActors}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', color: '#f97316' }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>LINKED CRYPTO ADDRESSES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.linkedCryptoAddresses}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
            <Network size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ACTIVE ALERTS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpis.activeAlerts}</div>
          </div>
        </div>
      </div>

      {/* Grid Row 2 */}
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Dark Web Activity Feed</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Activity</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.activity.map((act: any, idx: number) => (
                <tr key={idx}>
                  <td>{act.time}</td>
                  <td>{act.source}</td>
                  <td>{act.activity}</td>
                  <td><Badge t={act.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Synthetic Wallet Volume Trend</h3>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={[
              { d: 'Aug 12', v: 1.25 },
              { d: 'Aug 15', v: 2.05 },
              { d: 'Aug 19', v: 0.85 },
              { d: 'Aug 25', v: 1.60 },
              { d: 'Sep 01', v: 2.40 }
            ]}>
              <XAxis dataKey="d" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
              <Line type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Row 3 */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Investigator Active Alerts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.alerts.map((al: any) => (
            <div
              key={al.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: '#070a11',
                border: '1px solid #1e293b',
                borderRadius: '6px'
              }}
            >
              <AlertTriangle size={18} color="#f97316" />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{al.title || al.description}</strong>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Status: {al.status} | Severity: {al.severity}
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => navigate('/alerts')}
              >
                Inspect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
