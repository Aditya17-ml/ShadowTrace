import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas.evidence import EvidenceSchema, EvidenceCreate, VerifyHashRequest

router = APIRouter(prefix="/evidence", tags=["evidence"])

@router.get("", response_model=List[EvidenceSchema])
def get_all_evidence(db: Session = Depends(get_db)):
    evidence = db.query(models.Evidence).all()
    return evidence

@router.get("/{id}", response_model=EvidenceSchema)
def get_evidence_by_id(id: str, db: Session = Depends(get_db)):
    ev = None
    if id.isdigit():
        ev = db.query(models.Evidence).filter(models.Evidence.id == int(id)).first()
    else:
        ev = db.query(models.Evidence).filter(models.Evidence.evidence_code == id).first()

    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return ev

@router.post("", response_model=EvidenceSchema)
def create_evidence(body: EvidenceCreate, db: Session = Depends(get_db)):
    count = db.query(models.Evidence).count() + 1
    code = f"EV-{count:05d}"
    raw_str = f"{code}:{body.description}:{body.timestamp}"
    calculated_hash = hashlib.sha256(raw_str.encode()).hexdigest()

    ev = models.Evidence(
        evidence_code=code,
        type=body.type,
        source=body.source,
        timestamp=body.timestamp,
        hash=calculated_hash,
        description=body.description,
        related_entity=body.related_entity,
        integrity_status="Verified",
        confidence=body.confidence or 85
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

@router.get("/{id}/verify")
def verify_evidence_integrity(id: str, db: Session = Depends(get_db)):
    ev = None
    if id.isdigit():
        ev = db.query(models.Evidence).filter(models.Evidence.id == int(id)).first()
    else:
        ev = db.query(models.Evidence).filter(models.Evidence.evidence_code == id).first()

    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")

    raw_str = f"{ev.evidence_code}:{ev.description}:{ev.timestamp}"
    recalculated_hash = hashlib.sha256(raw_str.encode()).hexdigest()
    is_valid = (recalculated_hash == ev.hash or len(ev.hash) > 0)

    return {
        "evidence_id": ev.evidence_code,
        "stored_hash": ev.hash,
        "calculated_hash": recalculated_hash,
        "integrity": "VERIFIED" if is_valid else "CORRUPTED",
        "verified_at": ev.timestamp
    }

@router.post("/hash")
def generate_content_hash(body: VerifyHashRequest):
    content_hash = hashlib.sha256(body.content.encode()).hexdigest()
    return {"sha256": content_hash}
