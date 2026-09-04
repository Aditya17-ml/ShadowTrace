from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas.actor import ThreatActorSchema, AliasSchema
from app.providers.mock_ai import mock_ai

router = APIRouter(prefix="/actors", tags=["actors"])

@router.get("", response_model=List[ThreatActorSchema])
def get_actors(db: Session = Depends(get_db)):
    actors = db.query(models.ThreatActor).all()
    return actors

@router.get("/{id}")
def get_actor_detail(id: str, db: Session = Depends(get_db)):
    # Support numeric ID or actor_code string
    if id.isdigit():
        actor = db.query(models.ThreatActor).filter(models.ThreatActor.id == int(id)).first()
    else:
        actor = db.query(models.ThreatActor).filter(
            (models.ThreatActor.actor_code == id) | (models.ThreatActor.name.ilike(id))
        ).first()

    if not actor:
        # Fallback to first actor if not found for seamless demo
        actor = db.query(models.ThreatActor).first()
        if not actor:
            raise HTTPException(status_code=404, detail="Threat actor not found")

    aliases = [a.name for a in actor.aliases]
    entities = db.query(models.Entity).filter(models.Entity.actor_id == actor.id).all()
    entity_items = [
        {
            "id": e.id,
            "type": e.type,
            "value": e.value,
            "status": e.status,
            "confidence": e.confidence
        } for e in entities
    ]

    ai_analysis = mock_ai.generate_actor_summary(actor.name, aliases, actor.confidence_score)

    return {
        "actor": {
            "id": actor.id,
            "actor_code": actor.actor_code,
            "name": actor.name,
            "risk": actor.risk_level,
            "confidence": actor.confidence_score,
            "status": actor.status,
            "summary": actor.summary,
            "aliases": aliases
        },
        "entities": entity_items,
        "activityCategories": ["Zero-day exploit brokerage", "Data breach trading", "Ransomware RDP discussions", "Darknet forum admin"],
        "aiAnalysis": ai_analysis
    }

@router.get("/{id}/aliases", response_model=List[AliasSchema])
def get_actor_aliases(id: int, db: Session = Depends(get_db)):
    aliases = db.query(models.Alias).filter(models.Alias.actor_id == id).all()
    return aliases

@router.get("/{id}/entities")
def get_actor_entities(id: int, db: Session = Depends(get_db)):
    entities = db.query(models.Entity).filter(models.Entity.actor_id == id).all()
    return entities

@router.get("/{id}/evidence")
def get_actor_evidence(id: int, db: Session = Depends(get_db)):
    evidence = db.query(models.Evidence).all()
    return evidence

@router.get("/{id}/timeline")
def get_actor_timeline(id: int, db: Session = Depends(get_db)):
    events = db.query(models.TimelineEvent).all()
    return events

@router.get("/{id}/graph")
def get_actor_graph(id: str, db: Session = Depends(get_db)):
    actor = db.query(models.ThreatActor).first()
    entities = db.query(models.Entity).filter(models.Entity.actor_id == actor.id).all()
    relationships = db.query(models.Relationship).all()

    nodes = [{"id": str(actor.id), "label": actor.name, "type": "Actor"}]
    for e in entities:
        nodes.append({"id": f"E-{e.id}", "label": e.value, "type": e.type, "status": e.status})

    edges = []
    for r in relationships:
        edges.append({
            "source": r.source,
            "target": r.target,
            "label": r.relationship_type,
            "confidence": r.confidence
        })

    return {"nodes": nodes, "edges": edges}
