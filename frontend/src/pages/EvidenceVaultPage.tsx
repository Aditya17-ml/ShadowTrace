import React, { useEffect, useState } from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';

export function EvidenceVaultPage() {
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    api.getEvidenceList()
      .then((data) => {
        setEvidenceList(data);
        if (data.length > 0) setSelectedEvidence(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVerifyIntegrity = async (id: string) => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await api.verifyEvidence(id);
      setVerificationResult(result);
    } catch (err: any) {
      setVerificationResult({ integrity: 'ERROR', error: err.message });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <div className="loading-box">Loading Synthetic Evidence Vault...</div>;
  }

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>EVIDENCE VAULT</span>
          <h2>Cryptographic Evidence Directory & SHA-256 Verification</h2>
          <p>Real-time backend recalculation and hash integrity audit for forensic records.</p>
        </div>
      </section>

      <div className="grid grid-3">
        {/* Evidence Directory Table */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#38bdf8" /> Synthetic Evidence Log ({evidenceList.length})
          </h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Source</th>
                <th>SHA-256 Hash</th>
                <th>Integrity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {evidenceList.map((ev: any) => (
                <tr
                  key={ev.id}
                  style={{
                    cursor: 'pointer',
                    background: selectedEvidence?.id === ev.id ? 'var(--bg-card-hover)' : 'transparent'
                  }}
                  onClick={() => {
                    setSelectedEvidence(ev);
                    setVerificationResult(null);
                  }}
                >
                  <td><strong className="mono" style={{ color: '#38bdf8' }}>{ev.evidence_code}</strong></td>
                  <td>{ev.type}</td>
                  <td>{ev.source}</td>
                  <td className="mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {ev.hash.substring(0, 16)}...
                  </td>
                  <td><Badge t={ev.integrity_status || 'Verified'} /></td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvidence(ev);
                        handleVerifyIntegrity(ev.evidence_code);
                      }}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Evidence Detail & Live Verification */}
        {selectedEvidence && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10b981" /> Evidence Verification Audit
            </h3>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>EVIDENCE CODE</span>
                <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }} className="mono">
                  {selectedEvidence.evidence_code}
                </strong>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>DESCRIPTION</span>
                <p style={{ color: '#fff', marginTop: '0.25rem' }}>{selectedEvidence.description}</p>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block' }}>STORED SHA-256 HASH</span>
                <div
                  className="mono"
                  style={{
                    background: '#070a11',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: '#38bdf8',
                    wordBreak: 'break-all',
                    marginTop: '0.25rem'
                  }}
                >
                  {selectedEvidence.hash}
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                onClick={() => handleVerifyIntegrity(selectedEvidence.evidence_code)}
                disabled={verifying}
              >
                <RefreshCw size={16} className={verifying ? 'spin' : ''} />
                {verifying ? 'Recalculating SHA-256...' : 'Run Real Backend Integrity Audit'}
              </button>

              {verificationResult && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    background: verificationResult.integrity === 'VERIFIED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${verificationResult.integrity === 'VERIFIED' ? '#10b981' : '#ef4444'}`
                  }}
                >
                  <strong style={{ color: verificationResult.integrity === 'VERIFIED' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> INTEGRITY STATUS: {verificationResult.integrity}
                  </strong>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Calculated Hash: <span className="mono" style={{ color: '#fff' }}>{verificationResult.calculated_hash}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
