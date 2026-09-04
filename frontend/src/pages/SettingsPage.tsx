import React from 'react';
import { Settings, Database, Shield, Cpu } from 'lucide-react';

export function SettingsPage() {
  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>SYSTEM CONFIGURATION</span>
          <h2>Platform & Correlation Engine Settings</h2>
          <p>Configure SIH 2026 database parameters, correlation weights, and security policies.</p>
        </div>
      </section>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} color="#38bdf8" /> PostgreSQL Database Settings
          </h3>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>DATABASE URL</span>
              <div className="mono" style={{ background: '#070a11', padding: '0.5rem', borderRadius: '4px', color: '#fff', marginTop: '0.25rem' }}>
                postgresql+psycopg://shadowtrace:****@postgres:5432/shadowtrace
              </div>
            </div>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>DATABASE STATUS</span>
              <p style={{ color: '#10b981', fontWeight: 600, marginTop: '0.25rem' }}>CONNECTED & SEEDED</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#38bdf8" /> Correlation Scoring Rule Weights
          </h3>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
              <span>PGP Key Reuse</span>
              <strong style={{ color: '#38bdf8' }}>30% Max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
              <span>Blockchain Flow Analysis</span>
              <strong style={{ color: '#38bdf8' }}>20% Max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
              <span>Username / Alias Similarity</span>
              <strong style={{ color: '#38bdf8' }}>15% Max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
              <span>Domain / Hidden Service Overlap</span>
              <strong style={{ color: '#38bdf8' }}>15% Max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
              <span>Temporal Window Correlation</span>
              <strong style={{ color: '#38bdf8' }}>10% Max</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span>Document Metadata Overlap</span>
              <strong style={{ color: '#38bdf8' }}>10% Max</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
