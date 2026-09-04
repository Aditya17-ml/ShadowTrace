from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db, engine, Base
from app.db import models
from app.seed.seed_data import seed_db

from app.api.routes import (
    auth, dashboard, actors, entities, search,
    investigations, blockchain, evidence, timeline, alerts, reports
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto initialize DB tables and seed data on startup if empty
    Base.metadata.create_all(bind=engine)
    try:
        seed_db()
    except Exception as e:
        print(f"Seed initialization note: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Dark Web Threat Actor De-anonymization Platform (SIH 2026 / NTRO)",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.post("/api/login")
def login_alias(body: auth.LoginRequest, db: Session = Depends(get_db)):
    return auth.login(body, db)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(actors.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(investigations.router, prefix=settings.API_V1_STR)
app.include_router(blockchain.router, prefix=settings.API_V1_STR)
app.include_router(evidence.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "ShadowTrace Backend API",
        "environment": settings.ENVIRONMENT,
        "demo_mode": True
    }

@app.get("/api/health/database")
def health_database(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        actor_count = db.query(models.ThreatActor).count()
        return {
            "status": "ok",
            "database": "connected",
            "threat_actors_seeded": actor_count,
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
