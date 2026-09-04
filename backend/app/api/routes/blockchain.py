from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/blockchain", tags=["blockchain"])

@router.get("/addresses")
def get_blockchain_addresses(db: Session = Depends(get_db)):
    addresses = db.query(models.CryptoAddress).all()
    result = []
    for a in addresses:
        tx_count = db.query(models.Transaction).filter(
            (models.Transaction.from_address == a.address) | (models.Transaction.to_address == a.address)
        ).count()
        incoming = db.query(models.Transaction).filter(models.Transaction.to_address == a.address).all()
        outgoing = db.query(models.Transaction).filter(models.Transaction.from_address == a.address).all()
        inc_val = sum(t.value for t in incoming)
        out_val = sum(t.value for t in outgoing)
        result.append({
            "address": a.address,
            "currency": a.currency,
            "transactionCount": tx_count,
            "incoming": round(inc_val, 2),
            "outgoing": round(out_val, 2),
            "firstSeen": a.first_seen or "2026-08-12",
            "lastSeen": a.last_seen or "2026-08-25",
            "risk": a.risk_score
        })
    return {"addresses": result}

@router.get("/address/{address}")
def get_address_detail(address: str, db: Session = Depends(get_db)):
    addr = db.query(models.CryptoAddress).filter(models.CryptoAddress.address == address).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Crypto address not found")
    txs = db.query(models.Transaction).filter(
        (models.Transaction.from_address == address) | (models.Transaction.to_address == address)
    ).all()
    return {
        "address": addr.address,
        "currency": addr.currency,
        "risk_score": addr.risk_score,
        "first_seen": addr.first_seen,
        "last_seen": addr.last_seen,
        "transactions": txs
    }

@router.get("/address/{address}/transactions")
def get_address_transactions(address: str, db: Session = Depends(get_db)):
    txs = db.query(models.Transaction).filter(
        (models.Transaction.from_address == address) | (models.Transaction.to_address == address)
    ).all()
    return txs

@router.get("/address/{address}/relationships")
def get_address_relationships(address: str, db: Session = Depends(get_db)):
    txs = db.query(models.Transaction).filter(
        (models.Transaction.from_address == address) | (models.Transaction.to_address == address)
    ).all()
    connected = set()
    for t in txs:
        if t.from_address != address:
            connected.add(t.from_address)
        if t.to_address != address:
            connected.add(t.to_address)
    return {"target_address": address, "connected_addresses": list(connected)}

@router.post("/analyze")
def analyze_blockchain_cluster(body: dict, db: Session = Depends(get_db)):
    addresses = db.query(models.CryptoAddress).limit(5).all()
    txs = db.query(models.Transaction).limit(10).all()
    return {
        "analysis": "Multi-hop wallet transaction relationship clustering completed.",
        "cluster_risk": "HIGH",
        "primary_wallet": "DEMO-BTC-001",
        "connected_wallets": [a.address for a in addresses],
        "total_volume": round(sum(t.value for t in txs), 2)
    }

@router.get("")
def get_blockchain_dashboard(db: Session = Depends(get_db)):
    addr_resp = get_blockchain_addresses(db)
    txs = db.query(models.Transaction).limit(15).all()
    tx_items = [
        {
            "id": t.tx_hash,
            "from": t.from_address,
            "to": t.to_address,
            "value": t.value,
            "date": t.timestamp or "2026-08-15"
        } for t in txs
    ]
    return {"addresses": addr_resp["addresses"], "transactions": tx_items}
