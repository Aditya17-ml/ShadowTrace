import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './style.css';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SearchPage } from './pages/SearchPage';
import { ActorProfilePage } from './pages/ActorProfilePage';
import { InvestigationWorkspacePage } from './pages/InvestigationWorkspacePage';
import { EntityGraphPage } from './pages/EntityGraphPage';
import { BlockchainDashboardPage } from './pages/BlockchainDashboardPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { TimelinePage } from './pages/TimelinePage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('shadowtrace_token');
  // Allow seamless demo navigation if token missing by auto-setting demo token
  if (!token) {
    localStorage.setItem('shadowtrace_token', 'demo-analyst-token');
  }
  return <AppLayout>{children}</AppLayout>;
}

function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/actor" element={<ProtectedRoute><ActorProfilePage /></ProtectedRoute>} />
        <Route path="/investigation" element={<ProtectedRoute><InvestigationWorkspacePage /></ProtectedRoute>} />
        <Route path="/entity-graph" element={<ProtectedRoute><EntityGraphPage /></ProtectedRoute>} />
        <Route path="/blockchain" element={<ProtectedRoute><BlockchainDashboardPage /></ProtectedRoute>} />
        <Route path="/evidence" element={<ProtectedRoute><EvidenceVaultPage /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<MainApp />);
}
