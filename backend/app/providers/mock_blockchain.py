from typing import List, Dict, Any
from app.providers.base import BaseIntelligenceProvider

class MockBlockchainProvider(BaseIntelligenceProvider):
    def fetch_data(self, query: str) -> List[Dict[str, Any]]:
        return [
            {
                "tx_hash": "TX-DEMO-99120",
                "from": "DEMO-BTC-001",
                "to": "DEMO-BTC-002",
                "value": 1.25,
                "currency": "BTC",
                "timestamp": "2026-08-12T14:30:00Z"
            }
        ]

mock_blockchain = MockBlockchainProvider()
