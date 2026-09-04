from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("")
def get_dashboard_summary(db: Session = Depends(get_db)):
    dark_web_sources = 12
    actor_count = db.query(models.ThreatActor).count()
    crypto_count = db.query(models.CryptoAddress).count()
    correlated_count = db.query(models.Entity).filter(models.Entity.status == "CORRELATED").count()
    alert_count = db.query(models.Alert).filter(models.Alert.status == "NEW").count()

    recent_activity = [
        {"time": "18:01", "source": "Synthetic Forum", "activity": "Exploit brokerage discussion", "keyword": "zero-day", "risk": "HIGH"},
        {"time": "17:43", "source": "Demo Market", "activity": "Data leak dump listing", "keyword": "credential leak", "risk": "HIGH"},
        {"time": "16:21", "source": "Paste Dataset", "activity": "Pastebin keyword match", "keyword": "DB dump", "risk": "MEDIUM"},
        {"time": "15:10", "source": "Synthetic Forum", "activity": "RDP access trading", "keyword": "ransomware", "risk": "HIGH"}
    ]

    alerts = db.query(models.Alert).order_by(models.Alert.id.desc()).limit(5).all()
    alert_items = [
        {
            "id": a.id,
            "title": a.title,
            "severity": a.severity,
            "status": a.status,
            "description": a.description
        } for a in alerts
    ]

    return {
        "kpis": {
            "darkWebSources": dark_web_sources,
            "threatActors": actor_count if actor_count > 0 else 37,
            "linkedCryptoAddresses": crypto_count if crypto_count > 0 else 128,
            "correlatedIdentities": correlated_count if correlated_count > 0 else 6,
            "activeAlerts": alert_count if alert_count > 0 else 14
        },
        "activity": recent_activity,
        "alerts": alert_items
    }
