import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../services/api';

export function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await api.search(query.trim());
      if (res.results && res.results.length > 0) {
        const item = res.results[0];
        if (item.type === 'threat_actor' || item.type === 'alias') {
          navigate(`/actor?id=${item.id}`);
        } else {
          navigate(`/entity-graph?q=${encodeURIComponent(query)}`);
        }
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header>
      <div className="header-title">
        <h1>Investigator Decision-Support Console</h1>
        <span>Smart India Hackathon 2026 (SIH26151) — NTRO</span>
      </div>

      <form className="header-search" onSubmit={handleSearch}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actor, alias, PGP, domain, crypto address, hash..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="user-avatar" title="NTRO Lead Investigator">
        AN
      </div>
    </header>
  );
}
