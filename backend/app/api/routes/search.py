from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/search", tags=["search"])

@router.get("")
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    query_str = f"%{q.strip()}%"
    results = []

    # 1. Threat Actors
    actors = db.query(models.ThreatActor).filter(models.ThreatActor.name.ilike(query_str)).all()
    for a in actors:
        results.append({
            "id": a.id,
            "type": "threat_actor",
            "name": a.name,
            "confidence": a.confidence_score,
            "risk": a.risk_level,
            "item": {
                "id": f"A-{a.id:03d}",
                "db_id": a.id,
                "name": a.name,
                "status": a.status,
                "risk": a.risk_level,
                "confidence": a.confidence_score,
                "aliases": [al.name for al in a.aliases]
            }
        })

    # 2. Aliases
    aliases = db.query(models.Alias).filter(models.Alias.name.ilike(query_str)).all()
    for al in aliases:
        if al.actor:
            results.append({
                "id": al.actor.id,
                "type": "alias",
                "name": al.name,
                "confidence": al.confidence,
                "item": {
                    "id": f"A-{al.actor.id:03d}",
                    "db_id": al.actor.id,
                    "name": al.actor.name,
                    "status": al.actor.status,
                    "risk": al.actor.risk_level,
                    "confidence": al.actor.confidence_score
                }
            })

    # 3. Entities (Domains, Crypto, Email, PGP, etc)
    entities = db.query(models.Entity).filter(models.Entity.value.ilike(query_str)).all()
    for e in entities:
        results.append({
            "id": e.id,
            "type": "entity",
            "entity_type": e.type,
            "name": e.value,
            "confidence": e.confidence,
            "item": {
                "id": f"E-{e.id}",
                "value": e.value,
                "status": e.status,
                "type": e.type
            }
        })

    return {
        "query": q,
        "results": results
    }
