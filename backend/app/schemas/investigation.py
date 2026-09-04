from typing import Optional, List, Any
from pydantic import BaseModel

class InvestigationCreate(BaseModel):
    title: str
    description: Optional[str] = None
    actor_id: Optional[int] = None
    priority: Optional[str] = "HIGH"

class InvestigationSchema(BaseModel):
    id: int
    investigation_code: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    actor_id: Optional[int] = None

    class Config:
        from_attributes = True
