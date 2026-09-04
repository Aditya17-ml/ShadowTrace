from typing import Optional
from pydantic import BaseModel

class EvidenceCreate(BaseModel):
    type: str
    source: str
    timestamp: str
    description: str
    related_entity: Optional[str] = None
    confidence: Optional[int] = 85

class EvidenceSchema(BaseModel):
    id: int
    evidence_code: str
    type: str
    source: str
    timestamp: str
    hash: str
    description: str
    related_entity: Optional[str] = None
    integrity_status: str
    confidence: int

    class Config:
        from_attributes = True

class VerifyHashRequest(BaseModel):
    content: str
