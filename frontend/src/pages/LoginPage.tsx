import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { api } from '../services/api';

export function LoginPage() {
  const [username, setUsername] = useState('analyst');
  const [password, setPassword] = useState('shadowtrace-demo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('shadowtrace_token', res.access_token || 'demo-token');
      navigate('/dashboard');
    } catch (err: any) {
      if (username === 'analyst' && password === 'shadowtrace-demo') {
        localStorage.setItem('shadowtrace_token', 'demo-token');
        navigate('/dashboard');
      } else {
        setError(err.message || 'Invalid investigator credentials. Try analyst / shadowtrace-demo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0f172a 0%, #070a11 100%)',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: '#38bdf8' }}>
          <Shield size={40} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>ShadowTrace</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>"From Anonymity to Accountability"</p>

        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '6px',
          padding: '0.5rem',
          color: '#38bdf8',
          fontSize: '0.75rem',
          fontWeight: 600,
          margin: '1.25rem 0'
        }}>
          SIH 2026 DEMO / SYNTHETIC DATASET ONLY
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                background: '#070a11',
                border: '1px solid #1e293b',
                color: '#fff',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                background: '#070a11',
                border: '1px solid #1e293b',
                color: '#fff',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            <Lock size={16} />
            {loading ? 'Authenticating...' : 'Sign In as Investigator'}
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
          Demo Credentials: <code>analyst</code> / <code>shadowtrace-demo</code>
        </p>
      </div>
    </div>
  );
}
