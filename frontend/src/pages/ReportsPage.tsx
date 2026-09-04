import React, { useEffect, useState } from 'react';
import { FileText, Download, Play, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';

export function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = () => {
    setLoading(true);
    api.getReports()
      .then((res) => {
        if (res.reports && res.reports.length > 0) {
          return api.getReports();
        }
      })
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleGenerateNew = async () => {
    setGenerating(true);
    try {
      const res = await api.generateReport('INV-001');
      setReport({ reports: [res] });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ShadowTrace_Investigation_Report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadPDF = () => {
    window.open('http://localhost:8000/api/reports/RPT-2026-001/download/pdf', '_blank');
  };

  if (loading) {
    return <div className="loading-box">Generating Investigation Report...</div>;
  }

  const currentRep = report?.reports?.[0] || {};
  const content = currentRep.content_json || currentRep.content || {
    actor: 'ShadowKing',
    confidence_score: 72,
    aliases: ['shadowking', 'alpha_1337', 'forum_user_xyz'],
    reasons: [
      { factor: 'PGP fingerprint match (DEMO-8F42)', score: 30 },
      { factor: 'Username similarity (shadowking / alpha_1337)', score: 15 },
      { factor: 'Temporal activity correlation', score: 10 },
      { factor: 'Blockchain transaction flow', score: 17 }
    ],
    limitations: 'INVESTIGATIVE HYPOTHESIS ONLY: Academic Smart India Hackathon prototype using synthetic data.',
    analyst_conclusion: 'Multi-source synthetic correlation indicates strong operational overlap between investigated handles.'
  };

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>REPORT GENERATION</span>
          <h2>NTRO Threat Actor De-anonymization Report</h2>
          <p>Formal investigator decision-support report with evidence trail & explainable attribution scores.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={exportJSON}>
            <Download size={16} /> Export JSON
          </button>
          <button className="btn-primary" onClick={downloadPDF}>
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </section>

      {/* Main Report Document Container */}
      <div className="card" style={{ background: '#0d1322', border: '1px solid #38bdf8', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700 }} className="mono">
              REPORT ID: {currentRep.id || 'RPT-2026-001'}
            </span>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Target Dossier: {content.actor || 'ShadowKing'}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Investigation Code: INV-001 | Lead Analyst: NTRO Investigator</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>{content.confidence_score}%</div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>HIGH CONFIDENCE</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>1. Executive Summary</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
            This report presents an evidence-driven attribution hypothesis correlating fragmented synthetic intelligence sources
            associated with <strong>{content.actor}</strong>. Multi-source analysis identified repeated usage of PGP fingerprint
            DEMO-8F42, shared darknet hidden service infrastructure (darkshop.onion), and multi-hop crypto routing via DEMO-BTC-001.
          </p>
        </div>

        {/* Section 2: Identified Aliases & Entities */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>2. Correlated Handles & Entities</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {(content.aliases || ['shadowking', 'alpha_1337', 'forum_user_xyz']).map((a: string, i: number) => (
              <span key={i} className="mono" style={{ background: '#070a11', border: '1px solid #1e293b', color: '#38bdf8', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Explainable Score Breakdown */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>3. Explainable Confidence Factor Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Factor / Evidence Source</th>
                <th>Points Added</th>
              </tr>
            </thead>
            <tbody>
              {(content.reasons || []).map((r: any, idx: number) => (
                <tr key={idx}>
                  <td>{r.factor || r.reason}</td>
                  <td style={{ color: '#38bdf8', fontWeight: 700 }}>+{r.score || r.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Legal & Ethical Limitations */}
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.25rem' }}>4. Ethical & Legal Limitations</h4>
          <p style={{ color: '#f8fafc', fontSize: '0.8rem' }}>
            {content.limitations || 'INVESTIGATIVE HYPOTHESIS ONLY: Operating on synthetic test data for Smart India Hackathon 2026. This platform does not perform unauthorized surveillance or claim definitive real-person identification.'}
          </p>
        </div>

        {/* Section 5: Analyst Conclusion */}
        <div>
          <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>5. Analyst Conclusion & Recommended Next Steps</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {content.analyst_conclusion || 'The correlated synthetic indicators provide high-confidence decision support. Recommend issuing formal subpoena for darknet market log preservation.'}
          </p>
        </div>
      </div>
    </div>
  );
}
