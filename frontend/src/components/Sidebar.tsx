import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield, Network, Wallet, FileText, Clock, AlertTriangle, LogOut, Settings, LayoutDashboard, Search
} from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('shadowtrace_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Actor Analysis', path: '/actor', icon: Shield },
    { label: 'Investigation Workspace', path: '/investigation', icon: Network },
    { label: 'Entity Relationship Graph', path: '/entity-graph', icon: Network },
    { label: 'Blockchain Intelligence', path: '/blockchain', icon: Wallet },
    { label: 'Evidence Vault', path: '/evidence', icon: FileText },
    { label: 'Timeline', path: '/timeline', icon: Clock },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Shield size={26} color="#38bdf8" />
        <span>ShadowTrace</span>
      </div>
      <div className="sidebar-subbrand">NTRO Cyber Intelligence</div>
      <div className="demo-banner-small">SYNTHETIC DATA PROTOTYPE</div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ width: '100%', cursor: 'pointer', background: 'none' }} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
