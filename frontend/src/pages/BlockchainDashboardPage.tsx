import React, { useEffect, useState } from 'react';
import { Wallet, ArrowRight, Activity, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';

export function BlockchainDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlockchainDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="loading-box">Loading Synthetic Blockchain Intelligence...</div>;
  }

  const addresses = data.addresses || [];
  const transactions = data.transactions || [];

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>BLOCKCHAIN ANALYTICS</span>
          <h2>Synthetic Cryptocurrency Wallet Transaction Relationships</h2>
          <p>Demo wallet flow tracking. Academic hackathon simulation only — no real private wallet monitoring.</p>
        </div>
      </section>

      {/* Addresses Table */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wallet size={18} color="#38bdf8" /> Tracked Synthetic Wallet Clusters ({addresses.length})
        </h3>
        <table>
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Currency</th>
              <th>Tx Count</th>
              <th>Incoming Volume</th>
              <th>Outgoing Volume</th>
              <th>First Seen</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((a: any, idx: number) => (
              <tr key={idx}>
                <td>
                  <strong className="mono" style={{ color: '#fff' }}>{a.address}</strong>
                </td>
                <td>{a.currency || 'BTC'}</td>
                <td>{a.transactionCount}</td>
                <td style={{ color: '#10b981' }}>+{a.incoming} BTC</td>
                <td style={{ color: '#ef4444' }}>-{a.outgoing} BTC</td>
                <td>{a.firstSeen}</td>
                <td>
                  <Badge t={a.risk >= 70 ? 'HIGH' : a.risk >= 50 ? 'MEDIUM' : 'LOW'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Relationship Flow */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="#38bdf8" /> Synthetic Transaction Graph & Flow Analysis
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.map((tx: any, idx: number) => (
            <div
              key={idx}
              style={{
                background: '#070a11',
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="mono" style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>
                  {tx.from}
                </span>
                <ArrowRight size={18} color="#64748b" />
                <span className="mono" style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                  {tx.to}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>
                  {tx.value} BTC
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {tx.date} | Hash: <span className="mono">{tx.id || 'TX-DEMO'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
