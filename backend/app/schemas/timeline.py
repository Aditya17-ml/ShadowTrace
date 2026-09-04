from pydantic import BaseModel

class TimelineEventSchema(BaseModel):
    id: int
    event_date: str
    title: str
    source: str
    indicator: str
    confidence: int

    class Config:
        from_attributes = True
