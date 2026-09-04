from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Index, JSON
)
from sqlalchemy.orm import relationship
from app.db.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    full_name = Column(String(128), nullable=True)
    role = Column(String(32), default="Investigator")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class ThreatActor(Base):
    __tablename__ = "threat_actors"

    id = Column(Integer, primary_key=True, index=True)
    actor_code = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(128), index=True, nullable=False)
    risk_level = Column(String(32), default="MEDIUM")  # HIGH, MEDIUM, LOW
    confidence_score = Column(Integer, default=50)
    status = Column(String(64), default="Under Investigation")
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    aliases = relationship("Alias", back_populates="actor", cascade="all, delete-orphan")
    investigations = relationship("Investigation", back_populates="actor")
    alerts = relationship("Alert", back_populates="actor")

class Alias(Base):
    __tablename__ = "aliases"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("threat_actors.id"), nullable=False)
    name = Column(String(128), index=True, nullable=False)
    platform = Column(String(64), default="Synthetic Dark Web Forum")
    confidence = Column(Integer, default=80)
    created_at = Column(DateTime, default=utc_now)

    actor = relationship("ThreatActor", back_populates="aliases")

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    investigation_code = Column(String(32), unique=True, index=True, nullable=False)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(64), default="Under Investigation")
    priority = Column(String(32), default="HIGH")
    lead_analyst_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_id = Column(Integer, ForeignKey("threat_actors.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    actor = relationship("ThreatActor", back_populates="investigations")
    timeline_events = relationship("TimelineEvent", back_populates="investigation", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="investigation", cascade="all, delete-orphan")

class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    entity_code = Column(String(32), unique=True, index=True, nullable=False)
    type = Column(String(64), index=True, nullable=False) # Username, Email, PGP, Crypto, Domain, Document, IP
    value = Column(String(256), index=True, nullable=False)
    status = Column(String(32), default="OBSERVED") # OBSERVED, CORRELATED, INFERRED, UNVERIFIED
    confidence = Column(Integer, default=70)
    actor_id = Column(Integer, ForeignKey("threat_actors.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    crypto_details = relationship("CryptoAddress", back_populates="entity", uselist=False)
    domain_details = relationship("Domain", back_populates="entity", uselist=False)
    email_details = relationship("Email", back_populates="entity", uselist=False)
    pgp_details = relationship("PGPFingerprint", back_populates="entity", uselist=False)
    document_details = relationship("Document", back_populates="entity", uselist=False)

class CryptoAddress(Base):
    __tablename__ = "crypto_addresses"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=True)
    address = Column(String(128), unique=True, index=True, nullable=False)
    currency = Column(String(16), default="BTC")
    risk_score = Column(Integer, default=70)
    first_seen = Column(String(32), nullable=True)
    last_seen = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    entity = relationship("Entity", back_populates="crypto_details")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    tx_hash = Column(String(128), unique=True, index=True, nullable=False)
    from_address = Column(String(128), index=True, nullable=False)
    to_address = Column(String(128), index=True, nullable=False)
    value = Column(Float, default=0.0)
    currency = Column(String(16), default="BTC")
    timestamp = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=True)
    domain_name = Column(String(128), unique=True, index=True, nullable=False)
    registrar = Column(String(128), nullable=True)
    is_darkweb = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    entity = relationship("Entity", back_populates="domain_details")

class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=True)
    email_address = Column(String(128), unique=True, index=True, nullable=False)
    domain = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    entity = relationship("Entity", back_populates="email_details")

class PGPFingerprint(Base):
    __tablename__ = "pgp_fingerprints"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=True)
    fingerprint = Column(String(128), unique=True, index=True, nullable=False)
    key_id = Column(String(64), nullable=True)
    user_id_string = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    entity = relationship("Entity", back_populates="pgp_details")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=True)
    filename = Column(String(128), nullable=False)
    file_hash = Column(String(128), index=True, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    entity = relationship("Entity", back_populates="document_details")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    evidence_code = Column(String(32), unique=True, index=True, nullable=False)
    type = Column(String(64), nullable=False)
    source = Column(String(128), nullable=False)
    timestamp = Column(String(64), nullable=False)
    hash = Column(String(128), index=True, nullable=False)
    description = Column(Text, nullable=False)
    related_entity = Column(String(128), nullable=True)
    integrity_status = Column(String(32), default="Verified")
    confidence = Column(Integer, default=85)
    created_at = Column(DateTime, default=utc_now)

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(128), index=True, nullable=False)
    target = Column(String(128), index=True, nullable=False)
    relationship_type = Column(String(128), nullable=False)
    confidence = Column(Integer, default=75)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"), nullable=False)
    event_date = Column(String(64), nullable=False)
    title = Column(String(256), nullable=False)
    source = Column(String(128), nullable=False)
    indicator = Column(String(128), nullable=False)
    confidence = Column(Integer, default=80)
    created_at = Column(DateTime, default=utc_now)

    investigation = relationship("Investigation", back_populates="timeline_events")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    severity = Column(String(32), default="MEDIUM") # HIGH, MEDIUM, LOW
    actor_id = Column(Integer, ForeignKey("threat_actors.id"), nullable=True)
    status = Column(String(32), default="NEW") # NEW, REVIEWING, CONFIRMED, DISMISSED
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    actor = relationship("ThreatActor", back_populates="alerts")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String(32), unique=True, index=True, nullable=False)
    investigation_id = Column(Integer, ForeignKey("investigations.id"), nullable=False)
    analyst_name = Column(String(128), default="Analyst")
    confidence_score = Column(Integer, default=72)
    summary = Column(Text, nullable=False)
    content_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    investigation = relationship("Investigation", back_populates="reports")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(128), nullable=False)
    resource = Column(String(128), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=utc_now)
