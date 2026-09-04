import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Shield, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/Badge';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'ShadowKing';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.search(query)
      .then((res) => setResults(res.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <section className="hero-banner">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>MULTI-SOURCE SEARCH</span>
          <h2>Search Results for "{query}"</h2>
          <p>Database queries executed across threat actors, aliases, PGP keys, domains, and crypto addresses.</p>
        </div>
      </section>

      {loading ? (
        <div className="loading-box">Executing database search query...</div>
      ) : results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={40} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3>No synthetic records found matching "{query}"</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Try searching for <code>ShadowKing</code>, <code>alpha_1337</code>, <code>DEMO-8F42</code>, or <code>darkshop.onion</code>.
          </p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Found {results.length} Correlated Results</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Matched Value / Name</th>
                <th>Confidence</th>
                <th>Status / Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <span className="mono" style={{ color: '#38bdf8', fontWeight: 600 }}>
                      {res.type?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <strong>{res.name}</strong>
                  </td>
                  <td>{res.confidence}%</td>
                  <td>
                    <Badge t={res.risk || res.item?.status || 'CORRELATED'} />
                  </td>
                  <td>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => navigate(`/actor?id=${res.id}`)}
                    >
                      Start Investigation <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
