from typing import Optional
from pydantic import BaseModel

class AlertUpdate(BaseModel):
    status: str

class AlertSchema(BaseModel):
    id: int
    title: str
    severity: str
    actor_id: Optional[int] = None
    status: str
    description: str

    class Config:
        from_attributes = True
