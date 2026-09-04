from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/entities", tags=["entities"])

@router.get("")
def get_entities(db: Session = Depends(get_db)):
    entities = db.query(models.Entity).all()
    return entities

@router.get("/{id}")
def get_entity_detail(id: int, db: Session = Depends(get_db)):
    entity = db.query(models.Entity).filter(models.Entity.id == id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity

@router.get("/{id}/relationships")
def get_entity_relationships(id: str, db: Session = Depends(get_db)):
    rel = db.query(models.Relationship).filter(
        (models.Relationship.source == id) | (models.Relationship.target == id)
    ).all()
    return rel
