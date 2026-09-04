from typing import Optional
from pydantic import BaseModel

class EntitySchema(BaseModel):
    id: int
    entity_code: str
    type: str
    value: str
    status: str
    confidence: int

    class Config:
        from_attributes = True

class RelationshipSchema(BaseModel):
    id: int
    source: str
    target: str
    relationship_type: str
    confidence: int
    evidence_id: Optional[int] = None

    class Config:
        from_attributes = True
