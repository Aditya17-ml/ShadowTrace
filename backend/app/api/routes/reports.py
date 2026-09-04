from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(models.Report).all()
    return {
        "reports": [
            {
                "id": r.report_code,
                "db_id": r.id,
                "investigation_id": r.investigation_id,
                "actor": r.content_json.get("actor", "ShadowKing") if r.content_json else "ShadowKing",
                "status": "Ready",
                "confidence": r.confidence_score,
                "analyst": r.analyst_name,
                "created_at": r.created_at.isoformat() if r.created_at else None
            } for r in reports
        ]
    }

@router.get("/{id}")
def get_report_detail(id: str, db: Session = Depends(get_db)):
    rep = None
    if id.isdigit():
        rep = db.query(models.Report).filter(models.Report.id == int(id)).first()
    else:
        rep = db.query(models.Report).filter(models.Report.report_code == id).first()

    if not rep:
        rep = db.query(models.Report).first()
        if not rep:
            raise HTTPException(status_code=404, detail="Report not found")
    return rep

@router.post("/generate")
@router.post("/generate/{investigation_id}")
def generate_report(investigation_id: str = "INV-001", db: Session = Depends(get_db)):
    inv = db.query(models.Investigation).filter(
        (models.Investigation.investigation_code == investigation_id) | (models.Investigation.id == 1)
    ).first()

    actor = inv.actor if inv and inv.actor else db.query(models.ThreatActor).first()
    aliases = [a.name for a in actor.aliases] if actor else ["shadowking", "alpha_1337", "forum_user_xyz"]
    entities = db.query(models.Entity).filter(models.Entity.actor_id == actor.id).all() if actor else []
    evidence = db.query(models.Evidence).limit(5).all()

    count = db.query(models.Report).count() + 1
    code = f"RPT-2026-{count:03d}"

    content = {
        "report_id": code,
        "investigation_code": inv.investigation_code if inv else "INV-001",
        "analyst": "NTRO Senior Investigator",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor": actor.name if actor else "ShadowKing",
        "aliases": aliases,
        "related_entities": [e.value for e in entities],
        "evidence_summary": [f"{e.evidence_code}: {e.type} ({e.source})" for e in evidence],
        "blockchain_analysis": "Primary wallet DEMO-BTC-001 connected via 4 transactions.",
        "confidence_score": actor.confidence_score if actor else 72,
        "confidence_level": "HIGH",
        "reasons": [
            {"factor": "PGP Fingerprint Match (DEMO-8F42)", "score": 30},
            {"factor": "Username Similarity (shadowking / alpha_1337)", "score": 15},
            {"factor": "Temporal Activity Clustering", "score": 10},
            {"factor": "Blockchain Relationship Flow", "score": 17}
        ],
        "limitations": "INVESTIGATIVE HYPOTHESIS ONLY: Based exclusively on synthetic test data.",
        "analyst_conclusion": f"Synthetic intelligence correlation indicates strong operational links between handles {', '.join(aliases[:3])}. Hypothesis requires formal analyst validation."
    }

    rep = models.Report(
        report_code=code,
        investigation_id=inv.id if inv else 1,
        analyst_name="NTRO Senior Investigator",
        confidence_score=actor.confidence_score if actor else 72,
        summary=f"Multi-source correlation report generated for {actor.name if actor else 'ShadowKing'}.",
        content_json=content
    )
    db.add(rep)
    db.commit()
    db.refresh(rep)

    return {
        "reportId": code,
        "db_id": rep.id,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "actor": actor.name if actor else "ShadowKing",
        "confidence": rep.confidence_score,
        "content": content
    }

@router.get("/{id}/download/pdf")
def download_report_pdf(id: str, db: Session = Depends(get_db)):
    rep = db.query(models.Report).first()
    title = f"ShadowTrace Intelligence Report - {rep.report_code if rep else 'RPT-2026-001'}"

    # Generate text format PDF representation
    pdf_content = (
        f"%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
        f"2 0 obj << /Type /Pages /Kinds [3 0 R] /Count 1 >> endobj\n"
        f"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n"
        f"4 0 obj << /Length 200 >> stream\n"
        f"BT /F1 18 Tf 50 700 Td ({title}) Tj ET\n"
        f"BT /F1 12 Tf 50 650 Td (Target Actor: ShadowKing | Confidence: 72% | Risk: HIGH) Tj ET\n"
        f"BT /F1 10 Tf 50 600 Td (Disclaimer: Synthetic Data Investigation Hypothesis for NTRO SIH 2026) Tj ET\n"
        f"endstream endobj\n"
        f"xref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000210 00000 n\n"
        f"trailer << /Size 5 /Root 1 0 R >>\nstartxref\n450\n%%EOF"
    )
    return Response(content=pdf_content, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=ShadowTrace_{id}.pdf"})
