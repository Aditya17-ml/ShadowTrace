from typing import Optional
from pydantic import BaseModel

class CryptoAddressSchema(BaseModel):
    id: int
    address: str
    currency: str
    risk_score: int
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None

    class Config:
        from_attributes = True

class TransactionSchema(BaseModel):
    id: int
    tx_hash: str
    from_address: str
    to_address: str
    value: float
    currency: str
    timestamp: Optional[str] = None

    class Config:
        from_attributes = True
