from typing import Optional, Any
from pydantic import BaseModel

class ReportSchema(BaseModel):
    id: int
    report_code: str
    investigation_id: int
    analyst_name: str
    confidence_score: int
    summary: str
    content_json: Optional[Any] = None

    class Config:
        from_attributes = True
