const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("shadowtrace_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("shadowtrace_token");
    }
    const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorBody.detail || errorBody.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiRequest<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiRequest<any>("/auth/me"),

  // Dashboard
  getDashboard: () => apiRequest<any>("/dashboard"),

  // Search
  search: (q: string) => apiRequest<any>(`/search?q=${encodeURIComponent(q)}`),

  // Actors
  getActors: () => apiRequest<any>("/actors"),
  getActorDetail: (id: string | number) => apiRequest<any>(`/actors/${id}`),

  // Investigations
  getInvestigations: () => apiRequest<any>("/investigations"),
  getInvestigationDetail: (id: string | number) => apiRequest<any>(`/investigations/${id}`),
  getInvestigationGraph: (id: string | number) => apiRequest<any>(`/investigations/${id}/graph`),
  analyzeCorrelation: (id: string | number) => apiRequest<any>(`/investigations/${id}/analyze`, { method: "POST" }),
  getInvestigationTimeline: (id: string | number) => apiRequest<any>(`/investigations/${id}/timeline`),
  getInvestigationEvidence: (id: string | number) => apiRequest<any>(`/investigations/${id}/evidence`),

  // Blockchain
  getBlockchainDashboard: () => apiRequest<any>("/blockchain"),
  getAddressTransactions: (address: string) => apiRequest<any>(`/blockchain/address/${address}/transactions`),

  // Evidence
  getEvidenceList: () => apiRequest<any>("/evidence"),
  verifyEvidence: (id: string | number) => apiRequest<any>(`/evidence/${id}/verify`),
  verifyContentHash: (content: string) =>
    apiRequest<any>("/evidence/hash", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  // Timeline & Alerts
  getTimeline: () => apiRequest<any>("/timeline"),
  getAlerts: () => apiRequest<any>("/alerts"),
  updateAlertStatus: (id: number, status: string) =>
    apiRequest<any>(`/alerts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Reports
  getReports: () => apiRequest<any>("/reports"),
  generateReport: (investigationId: string = "INV-001") =>
    apiRequest<any>(`/reports/generate/${investigationId}`, { method: "POST" }),
};
