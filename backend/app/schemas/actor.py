from typing import List, Optional
from pydantic import BaseModel

class AliasSchema(BaseModel):
    id: int
    name: str
    platform: str
    confidence: int

    class Config:
        from_attributes = True

class ThreatActorSchema(BaseModel):
    id: int
    actor_code: str
    name: str
    risk_level: str
    confidence_score: int
    status: str
    summary: Optional[str] = None
    aliases: List[AliasSchema] = []

    class Config:
        from_attributes = True
