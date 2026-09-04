from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.correlation.engine import correlation_engine
from app.schemas.investigation import InvestigationCreate

router = APIRouter(prefix="/investigations", tags=["investigations"])

@router.get("")
def get_investigations(db: Session = Depends(get_db)):
    investigations = db.query(models.Investigation).all()
    return investigations

@router.post("")
def create_investigation(body: InvestigationCreate, db: Session = Depends(get_db)):
    actor = None
    if body.actor_id:
        actor = db.query(models.ThreatActor).filter(models.ThreatActor.id == body.actor_id).first()
    if not actor:
        actor = db.query(models.ThreatActor).first()

    code_num = db.query(models.Investigation).count() + 1
    inv = models.Investigation(
        investigation_code=f"INV-{code_num:03d}",
        title=body.title,
        description=body.description or f"Investigation into {actor.name if actor else 'synthetic entity'}",
        status="Under Investigation",
        priority=body.priority or "HIGH",
        actor_id=actor.id if actor else None
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv

@router.get("/{id}")
def get_investigation_detail(id: str, db: Session = Depends(get_db)):
    inv = None
    if id.isdigit():
        inv = db.query(models.Investigation).filter(models.Investigation.id == int(id)).first()
    else:
        inv = db.query(models.Investigation).filter(models.Investigation.investigation_code == id).first()

    if not inv:
        inv = db.query(models.Investigation).first()
        if not inv:
            raise HTTPException(status_code=404, detail="Investigation not found")

    actor = inv.actor or db.query(models.ThreatActor).first()

    return {
        "id": inv.investigation_code,
        "db_id": inv.id,
        "title": inv.title,
        "status": inv.status,
        "priority": inv.priority,
        "confidence": actor.confidence_score if actor else 72,
        "risk": actor.risk_level if actor else "HIGH",
        "actor": {
            "id": actor.id if actor else 1,
            "name": actor.name if actor else "ShadowKing",
            "code": actor.actor_code if actor else "ACTOR-001"
        }
    }

@router.post("/{id}/analyze")
def run_correlation_analysis(id: str, db: Session = Depends(get_db)):
    actor = db.query(models.ThreatActor).first()
    entities = db.query(models.Entity).filter(models.Entity.actor_id == actor.id).all() if actor else []
    aliases = [a.name for a in actor.aliases] if actor else ["shadowking", "alpha_1337", "forum_user_xyz"]

    entity_list = [{"type": e.type, "value": e.value} for e in entities]
    actor_data = {
        "id": actor.id if actor else 1,
        "name": actor.name if actor else "ShadowKing",
        "aliases": aliases,
        "entities": entity_list
    }

    result = correlation_engine.analyze_actor(actor_data)
    return result

@router.get("/{id}/graph")
def get_investigation_graph(id: str, db: Session = Depends(get_db)):
    actor = db.query(models.ThreatActor).first()
    entities = db.query(models.Entity).filter(models.Entity.actor_id == actor.id).all()
    relationships = db.query(models.Relationship).all()

    nodes = [{"id": "ShadowKing", "label": "ShadowKing", "type": "Actor", "risk": "HIGH"}]
    for e in entities:
        nodes.append({
            "id": e.value,
            "label": e.value,
            "type": e.type,
            "status": e.status,
            "confidence": e.confidence
        })

    edges = []
    for r in relationships:
        edges.append({
            "source": r.source,
            "target": r.target,
            "relationship": r.relationship_type,
            "confidence": r.confidence,
            "evidence_id": r.evidence_id
        })

    return {"nodes": nodes, "edges": edges}

@router.get("/{id}/timeline")
def get_investigation_timeline(id: str, db: Session = Depends(get_db)):
    events = db.query(models.TimelineEvent).all()
    return [
        {
            "id": e.id,
            "date": e.event_date,
            "event": e.title,
            "source": e.source,
            "indicator": e.indicator,
            "confidence": e.confidence
        } for e in events
    ]

@router.get("/{id}/evidence")
def get_investigation_evidence(id: str, db: Session = Depends(get_db)):
    evidence = db.query(models.Evidence).all()
    return evidence
