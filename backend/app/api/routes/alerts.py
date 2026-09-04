from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas.alert import AlertUpdate

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "severity": a.severity,
            "actor": a.actor.name if a.actor else "ShadowKing",
            "actor_id": a.actor_id,
            "status": a.status,
            "description": a.description
        } for a in alerts
    ]

@router.get("/{id}")
def get_alert_detail(id: int, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.patch("/{id}")
def update_alert_status(id: int, body: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    valid_statuses = ["NEW", "REVIEWING", "CONFIRMED", "DISMISSED"]
    if body.status.upper() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    alert.status = body.status.upper()
    db.commit()
    db.refresh(alert)
    return alert
