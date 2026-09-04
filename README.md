# ShadowTrace — Dark Web Threat Actor De-anonymization

> **Tagline:** *"From Anonymity to Accountability"*  
> **Problem Statement ID:** SIH26151  
> **Theme:** Blockchain & Cybersecurity  
> **Organization:** National Technical Research Organisation (NTRO)  
> **Event:** Smart India Hackathon 2026 (SIH 2026)  

---

## 1. Safety & Legal Boundary Notice

> [!IMPORTANT]
> **Academic Prototype & Investigator Decision-Support Disclaimer**:
> This platform operates exclusively on **synthetic Dark Web datasets**, simulated threat actor dossiers (`ShadowKing`, `alpha_1337`, `forum_user_xyz`), public OSINT concepts, synthetic cryptocurrency wallet transactions (`DEMO-BTC-001`), and test data.
>
> All system outputs represent **investigative attribution hypotheses** rather than definitive real-person identity claims. Every inferred relationship provides explicit evidence sources, reasoning, confidence percentages, timestamps, and classification tags (**OBSERVED**, **CORRELATED**, **INFERRED**, **UNVERIFIED**).

---

## 2. Solution Architecture

ShadowTrace ingests fragmented synthetic intelligence across 10 critical vectors:
1. Dark Web synthetic forum posts & marketplace listings
2. Public OSINT-style indicators & metadata
3. Cryptocurrency wallet transaction graphs
4. Username / alias reuse patterns
5. PGP fingerprint reuse across key registries
6. Domain & onion service registration overlap
7. Email address reuse across breach datasets
8. Document metadata (EXIF / author string overlap)
9. Temporal activity window correlation
10. Shared hosting & IP infrastructure

```
Frontend (React + Vite + Tailwind + React Flow)
        ↓
FastAPI Backend Services (Python 3.12 / Pydantic v2)
        ↓
PostgreSQL Database (SQLAlchemy 2 + Alembic)
        ↓
Deterministic Correlation Engine (Explainable Scoring + NetworkX Graph)
        ↓
SHA-256 Evidence Integrity Vault & Report Exporter
```

---

## 3. Technology Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Flow, Recharts, Lucide React, React Router v6, Axios/Fetch API client.
* **Backend:** Python 3.12, FastAPI, Uvicorn, SQLAlchemy 2, Alembic, Pydantic v2, Passlib (PBKDF2/bcrypt), Python-JOSE JWT, NetworkX, Pandas, ReportLab.
* **Database:** PostgreSQL 16 (or SQLite portable dev mode).
* **Testing:** Pytest, HTTPX, TestClient.
* **DevOps:** Docker, Docker Compose.

---

## 4. Database Schema (17 Models)

1. `users`: Investigator accounts and authentication.
2. `threat_actors`: Threat actor dossiers (`ShadowKing`, `NightRelay`, `CipherFox`, etc.).
3. `aliases`: Known and correlated handles across platforms.
4. `investigations`: Formal investigation cases (`INV-001`).
5. `entities`: Fragmented indicators (Username, Email, PGP, Crypto, Domain, Document, IP).
6. `crypto_addresses`: Synthetic wallet addresses with risk scores.
7. `transactions`: Cryptocurrency transaction edges between wallets.
8. `domains`: Darkweb onion services and WHOIS records.
9. `emails`: Associated email addresses.
10. `pgp_fingerprints`: PGP key fingerprints.
11. `documents`: Document file hashes and metadata.
12. `evidence`: Forensic evidence records with SHA-256 hashes.
13. `relationships`: Network graph edges between entities.
14. `timeline_events`: Time-series event records.
15. `alerts`: Investigator notification queue.
16. `reports`: Generated intelligence reports.
17. `audit_logs`: System access audit trail.

---

## 5. API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/health/database` | Database connectivity & seed check |
| `POST` | `/api/auth/login` | Authenticate investigator (JWT) |
| `GET` | `/api/search?q=ShadowKing` | Multi-source entity & actor search |
| `GET` | `/api/actors` | List threat actors |
| `GET` | `/api/actors/{id}` | Threat actor dossier & AI summary |
| `GET` | `/api/investigations/{id}` | Investigation details |
| `POST` | `/api/investigations/{id}/analyze` | Execute correlation engine scoring |
| `GET` | `/api/investigations/{id}/graph` | Fetch React Flow graph nodes/edges |
| `GET` | `/api/blockchain/addresses` | List synthetic wallet analytics |
| `GET` | `/api/evidence` | List evidence vault records |
| `GET` | `/api/evidence/{id}/verify` | Recalculate SHA-256 hash & verify integrity |
| `GET` | `/api/timeline` | Get chronological activity timeline |
| `GET` | `/api/alerts` | List investigator alerts |
| `PATCH` | `/api/alerts/{id}` | Update alert status |
| `POST` | `/api/reports/generate/{inv_id}` | Generate formal intelligence report |
| `GET` | `/api/reports/{id}/download/pdf` | Export PDF report document |

---

## 6. Demo Credentials & Quickstart

### Credentials
* **Username:** `analyst`
* **Password:** `shadowtrace-demo`

---

## 7. Windows Setup Commands (PowerShell)

### Step 1: Backend Setup
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed.seed_data
python -m pytest -v
uvicorn app.main:app --reload --port 8000
```

### Step 2: Frontend Setup
```powershell
cd frontend
npm install
npm run build
npm run dev
```

Open application in browser: `http://localhost:5173`  
Swagger API Documentation: `http://localhost:8000/docs`

---

## 8. Docker Commands

```powershell
# Build containers
docker compose build

# Start services (PostgreSQL, Backend, Frontend)
docker compose up -d

# Verify container status
docker compose ps

# Inspect logs
docker compose logs backend
docker compose logs postgres
docker compose logs frontend

# Stop containers
docker compose down
```

---

## 9. Primary SIH Presentation Demo Walkthrough

1. **Login:** Access console at `http://localhost:5173` using `analyst` / `shadowtrace-demo`.
2. **Dashboard:** View live SOC stats (37 Threat Actors, 128 Crypto Addresses, 14 Alerts).
3. **Search:** Search `ShadowKing` to view matched actor dossier.
4. **Dossier:** Open Actor Profile to view aliases (`shadowking`, `alpha_1337`, `forum_user_xyz`), confidence gauge (72%), and classification tags.
5. **Investigation Workspace:** Click **Start Investigation** -> view interactive React Flow Entity Graph.
6. **Graph Interaction:** Click `PGP` node `DEMO-8F42` or relationship edge to view evidence details.
7. **Correlation Analysis:** Click **Run Correlation Engine** -> review factor score breakdown (+30 PGP match, +15 Username similarity, +10 Temporal, +17 Blockchain).
8. **Blockchain Intelligence:** Navigate to **Blockchain Intelligence** -> inspect wallet `DEMO-BTC-001` transactions and flow graph.
9. **Evidence Vault:** Navigate to **Evidence Vault** -> select record `EV-00123` -> click **Run Real Backend Integrity Audit** to calculate and verify SHA-256 hash.
10. **Timeline:** Open **Timeline** -> review chronological events from Aug 01 to Sep 02.
11. **Reports:** Navigate to **Reports** -> click **Export PDF Report** or **Export JSON**.
