from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/timeline", tags=["timeline"])

@router.get("")
def get_timeline(db: Session = Depends(get_db)):
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
