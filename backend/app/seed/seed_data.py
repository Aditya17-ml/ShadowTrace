import hashlib
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, Base
from app.db.models import (
    User, Investigation, ThreatActor, Alias, Entity, CryptoAddress, Transaction, Domain, Email,
    PGPFingerprint, Document, Evidence, Relationship, TimelineEvent, Alert, Report, AuditLog
)
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. User
        if not db.query(User).filter(User.username == "analyst").first():
            user = User(
                username="analyst",
                email="analyst@shadowtrace.ntro.gov.in",
                hashed_password=get_password_hash("shadowtrace-demo"),
                full_name="NTRO Senior Intelligence Analyst",
                role="Lead Investigator",
                is_active=True
            )
            db.add(user)
            db.commit()

        # 2. Threat Actors (5)
        actor_names = [
            ("ShadowKing", "HIGH", 72, "Under Investigation", "Primary threat actor cluster associated with zero-day exploit brokerage and darknet market operations."),
            ("NightRelay", "MEDIUM", 54, "Monitoring", "Synthetic actor operating proxy relay infrastructure and anonymous bulletproof hosting."),
            ("CipherFox", "HIGH", 68, "Monitoring", "Synthetic actor involved in credential stuffing tools and automated leak distribution."),
            ("GreyNode", "LOW", 29, "Reviewing", "Synthetic low-risk actor associated with legacy paste bin activity."),
            ("NullHarbor", "MEDIUM", 47, "Monitoring", "Synthetic forum administrator across secondary darknet message boards.")
        ]

        actors_map = {}
        for idx, (name, risk, conf, status, summary) in enumerate(actor_names, 1):
            act = db.query(ThreatActor).filter(ThreatActor.name == name).first()
            if not act:
                act = ThreatActor(
                    actor_code=f"ACTOR-00{idx}",
                    name=name,
                    risk_level=risk,
                    confidence_score=conf,
                    status=status,
                    summary=summary
                )
                db.add(act)
                db.commit()
                db.refresh(act)
            actors_map[name] = act

        shadow_king = actors_map["ShadowKing"]

        # 3. Aliases (20)
        aliases_list = [
            ("shadowking", "ShadowForum", shadow_king.id),
            ("alpha_1337", "MarketX", shadow_king.id),
            ("forum_user_xyz", "DeepMarket", shadow_king.id),
            ("sk_admin", "Jabber", shadow_king.id),
            ("nightrelay", "RelayNode", actors_map["NightRelay"].id),
            ("nr_44", "Telegram", actors_map["NightRelay"].id),
            ("relayghost", "DarkForum", actors_map["NightRelay"].id),
            ("cipherfox", "FoxVault", actors_map["CipherFox"].id),
            ("cf_7", "PasteBin", actors_map["CipherFox"].id),
            ("greynode", "NodeList", actors_map["GreyNode"].id),
            ("gn_11", "AnonIRC", actors_map["GreyNode"].id),
            ("nullharbor", "HarborBoard", actors_map["NullHarbor"].id),
            ("nh_2", "DarkMarket", actors_map["NullHarbor"].id),
            ("harbornull", "Dread", actors_map["NullHarbor"].id),
            ("shadow_broker_99", "Dread", shadow_king.id),
            ("sk_operator", "TOX", shadow_king.id),
            ("fox_operator", "Dread", actors_map["CipherFox"].id),
            ("relay_op", "Jabber", actors_map["NightRelay"].id),
            ("null_op", "Telegram", actors_map["NullHarbor"].id),
            ("grey_op", "PasteBin", actors_map["GreyNode"].id)
        ]

        for alias_name, plat, a_id in aliases_list:
            if not db.query(Alias).filter(Alias.name == alias_name).first():
                db.add(Alias(actor_id=a_id, name=alias_name, platform=plat, confidence=82))
        db.commit()

        # 4. Entities (20)
        entities_data = [
            ("E-001", "Username", "shadowking", "Correlated", 88, shadow_king.id),
            ("E-002", "Username", "alpha_1337", "Correlated", 84, shadow_king.id),
            ("E-003", "Username", "forum_user_xyz", "Correlated", 79, shadow_king.id),
            ("E-004", "Email", "shadowking@demo-mail.example", "Observed", 74, shadow_king.id),
            ("E-005", "PGP", "DEMO-8F42-99A1-77BD", "Correlated", 91, shadow_king.id),
            ("E-006", "Crypto", "DEMO-BTC-001", "Inferred", 82, shadow_king.id),
            ("E-007", "Crypto", "DEMO-XMR-001", "Inferred", 70, shadow_king.id),
            ("E-008", "Domain", "darkshop.onion", "Observed", 76, shadow_king.id),
            ("E-009", "Document", "DOC-DEMO-778.pdf", "Observed", 73, shadow_king.id),
            ("E-010", "IP", "203.0.113.42", "Observed", 65, shadow_king.id),
            ("E-011", "Domain", "relayhost.onion", "Observed", 60, actors_map["NightRelay"].id),
            ("E-012", "Crypto", "DEMO-BTC-002", "Correlated", 65, shadow_king.id),
            ("E-013", "Crypto", "DEMO-BTC-003", "Inferred", 60, shadow_king.id),
            ("E-014", "Email", "cipherfox@demo-mail.example", "Observed", 68, actors_map["CipherFox"].id),
            ("E-015", "PGP", "DEMO-4A22-33FF-88CC", "Correlated", 85, actors_map["CipherFox"].id),
            ("E-016", "Domain", "foxleaks.onion", "Observed", 66, actors_map["CipherFox"].id),
            ("E-017", "Email", "greynode@demo-mail.example", "Observed", 50, actors_map["GreyNode"].id),
            ("E-018", "IP", "198.51.100.14", "Observed", 45, actors_map["GreyNode"].id),
            ("E-019", "Domain", "nullboard.onion", "Observed", 55, actors_map["NullHarbor"].id),
            ("E-020", "Document", "EXPLOIT-PAYLOAD-01.docx", "Observed", 70, shadow_king.id)
        ]

        for e_code, e_type, e_val, e_stat, e_conf, e_act in entities_data:
            if not db.query(Entity).filter(Entity.entity_code == e_code).first():
                ent = Entity(
                    entity_code=e_code,
                    type=e_type,
                    value=e_val,
                    status=e_stat,
                    confidence=e_conf,
                    actor_id=e_act
                )
                db.add(ent)
        db.commit()

        # 5. Domains (20)
        for i in range(1, 21):
            d_name = f"synthetic-dark-market-{i:02d}.onion"
            if not db.query(Domain).filter(Domain.domain_name == d_name).first():
                db.add(Domain(domain_name=d_name, registrar="Tor Onion Service", is_darkweb=True))
        db.commit()

        # 6. Crypto Addresses (20) & Transactions (50)
        for i in range(1, 21):
            addr = f"DEMO-BTC-{i:03d}"
            if not db.query(CryptoAddress).filter(CryptoAddress.address == addr).first():
                db.add(CryptoAddress(
                    address=addr,
                    currency="BTC",
                    risk_score=75 if i <= 3 else 40,
                    first_seen="2026-08-01",
                    last_seen="2026-08-30"
                ))
        db.commit()

        # Generate 50 transactions
        if db.query(Transaction).count() < 50:
            for i in range(1, 51):
                from_a = f"DEMO-BTC-{(i % 10) + 1:03d}"
                to_a = f"DEMO-BTC-{((i + 1) % 10) + 1:03d}"
                tx_h = f"TX-HASH-DEMO-{i:04d}"
                if not db.query(Transaction).filter(Transaction.tx_hash == tx_h).first():
                    db.add(Transaction(
                        tx_hash=tx_h,
                        from_address=from_a,
                        to_address=to_a,
                        value=round(0.1 + (i * 0.05), 2),
                        currency="BTC",
                        timestamp=f"2026-08-{(i % 28) + 1:02d}T10:00:00Z"
                    ))
            db.commit()

        # 7. Evidence Records (20)
        evidence_samples = [
            ("EV-00123", "Synthetic Forum Record", "Demo Dataset", "2026-08-05T11:20:00Z", "ShadowKing alias and DEMO-8F42 PGP fingerprint observed together in synthetic post.", "shadowking", 91),
            ("EV-00124", "Metadata Record", "Synthetic Domain Dataset", "2026-08-25T08:10:00Z", "Synthetic domain metadata overlaps the investigation dataset.", "darkshop.onion", 73),
            ("EV-00125", "Transaction Record", "Demo Blockchain", "2026-08-15T09:00:00Z", "Demo wallet transaction relationship detected between DEMO-BTC-001 and DEMO-BTC-002.", "DEMO-BTC-001", 82)
        ]
        for i in range(4, 21):
            evidence_samples.append((
                f"EV-{i:05d}",
                "OSINT Indicator",
                "Synthetic OSINT Provider",
                f"2026-08-{(i % 25) + 1:02d}T14:00:00Z",
                f"Synthetic indicator record #{i} correlated with actor cluster.",
                f"indicator_{i}",
                70 + (i % 20)
            ))

        for e_code, e_type, e_src, e_ts, e_desc, e_rel, e_conf in evidence_samples:
            if not db.query(Evidence).filter(Evidence.evidence_code == e_code).first():
                e_hash = hashlib.sha256(f"{e_code}:{e_desc}:{e_ts}".encode()).hexdigest()
                db.add(Evidence(
                    evidence_code=e_code,
                    type=e_type,
                    source=e_src,
                    timestamp=e_ts,
                    hash=e_hash,
                    description=e_desc,
                    related_entity=e_rel,
                    integrity_status="Verified",
                    confidence=e_conf
                ))
        db.commit()

        # 8. Investigation (1)
        inv = db.query(Investigation).filter(Investigation.investigation_code == "INV-001").first()
        if not inv:
            inv = Investigation(
                investigation_code="INV-001",
                title="Operation ShadowKing De-anonymization",
                description="Comprehensive multi-source correlation investigation targeting synthetic threat actor ShadowKing.",
                status="Under Investigation",
                priority="HIGH",
                actor_id=shadow_king.id
            )
            db.add(inv)
            db.commit()
            db.refresh(inv)

        # 9. Relationships for Graph
        relationships_data = [
            ("ShadowKing", "shadowking", "same username", 88),
            ("ShadowKing", "alpha_1337", "alias reuse", 84),
            ("ShadowKing", "forum_user_xyz", "same username pattern", 79),
            ("ShadowKing", "shadowking@demo-mail.example", "email association in synthetic record", 74),
            ("ShadowKing", "DEMO-8F42-99A1-77BD", "same PGP fingerprint", 91),
            ("ShadowKing", "DEMO-BTC-001", "blockchain relationship", 82),
            ("ShadowKing", "DEMO-XMR-001", "synthetic wallet relationship", 70),
            ("ShadowKing", "darkshop.onion", "shared synthetic infrastructure", 76),
            ("ShadowKing", "DOC-DEMO-778.pdf", "metadata similarity", 73),
            ("ShadowKing", "203.0.113.42", "temporal/infrastructure correlation", 65)
        ]
        for src, tgt, rel_type, conf in relationships_data:
            if not db.query(Relationship).filter(Relationship.source == src, Relationship.target == tgt).first():
                db.add(Relationship(source=src, target=tgt, relationship_type=rel_type, confidence=conf))
        db.commit()

        # 10. Timeline Events (30)
        timeline_samples = [
            ("2026-08-01", "ShadowKing account created", "Synthetic forum", "shadowking", 78),
            ("2026-08-05", "First synthetic forum activity", "Demo Dataset", "EV-00123", 82),
            ("2026-08-08", "PGP fingerprint observed", "Synthetic Forum", "DEMO-8F42-99A1-77BD", 91),
            ("2026-08-12", "Demo wallet created", "Demo Blockchain", "DEMO-BTC-001", 72),
            ("2026-08-15", "Transaction relationship detected", "Demo Blockchain", "TX-DEMO-99120", 82),
            ("2026-08-19", "Alias reused on secondary forum", "Synthetic Forum", "alpha_1337", 84),
            ("2026-08-25", "Domain relationship detected", "Synthetic Domain Dataset", "darkshop.onion", 76),
            ("2026-09-02", "Correlation score calculated at 72%", "Correlation Engine", "ACTOR-001", 72)
        ]
        for i in range(9, 31):
            timeline_samples.append((
                f"2026-08-{(i % 28) + 1:02d}",
                f"Synthetic indicator event #{i}",
                "OSINT Feed",
                f"IND-{i:03d}",
                70 + (i % 15)
            ))

        for d_str, title, src, ind, conf in timeline_samples:
            if not db.query(TimelineEvent).filter(TimelineEvent.title == title).first():
                db.add(TimelineEvent(
                    investigation_id=inv.id,
                    event_date=d_str,
                    title=title,
                    source=src,
                    indicator=ind,
                    confidence=conf
                ))
        db.commit()

        # 11. Alerts (15)
        alert_samples = [
            ("Same PGP fingerprint observed across 3 synthetic sources", "HIGH", shadow_king.id, "NEW", "Repeated usage of DEMO-8F42-99A1-77BD in key registries."),
            ("New wallet relationship detected", "HIGH", shadow_king.id, "REVIEWING", "DEMO-BTC-001 routed 1.25 BTC to secondary wallet."),
            ("Possible alias correlation", "MEDIUM", shadow_king.id, "NEW", "Lexical pattern overlap detected for alpha_1337."),
            ("Suspicious activity pattern", "MEDIUM", actors_map["CipherFox"].id, "NEW", "Elevated automated posting volume detected."),
            ("Confidence score updated", "LOW", actors_map["GreyNode"].id, "DISMISSED", "Score adjusted based on temporal decay.")
        ]
        for i in range(6, 16):
            alert_samples.append((
                f"Synthetic Alert Event #{i}",
                "MEDIUM" if i % 2 == 0 else "LOW",
                shadow_king.id if i % 2 == 0 else actors_map["NightRelay"].id,
                "NEW",
                f"Automated notification for synthetic event #{i}"
            ))

        for title, sev, act_id, st, desc in alert_samples:
            if not db.query(Alert).filter(Alert.title == title).first():
                db.add(Alert(
                    title=title,
                    severity=sev,
                    actor_id=act_id,
                    status=st,
                    description=desc
                ))
        db.commit()

        # 12. Report (1)
        if not db.query(Report).filter(Report.report_code == "RPT-2026-001").first():
            db.add(Report(
                report_code="RPT-2026-001",
                investigation_id=inv.id,
                analyst_name="NTRO Investigator",
                confidence_score=72,
                summary="Multi-source synthetic dark web threat actor correlation report for ShadowKing.",
                content_json={
                    "actor": "ShadowKing",
                    "confidence_score": 72,
                    "confidence_level": "HIGH",
                    "reasons": [
                        {"reason": "PGP fingerprint match", "points": 30},
                        {"reason": "Username similarity", "points": 15},
                        {"reason": "Temporal correlation", "points": 10},
                        {"reason": "Blockchain relationship", "points": 17}
                    ],
                    "disclaimer": "INVESTIGATIVE HYPOTHESIS ONLY: Based on synthetic datasets for Smart India Hackathon 2026."
                }
            ))
        db.commit()

        print("Database seeded successfully and idempotently!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
