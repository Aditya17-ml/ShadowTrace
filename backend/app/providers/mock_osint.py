from typing import List, Dict, Any
from app.providers.base import BaseIntelligenceProvider

class MockOSINTProvider(BaseIntelligenceProvider):
    def fetch_data(self, query: str) -> List[Dict[str, Any]]:
        return [
            {
                "type": "Domain WHOIS Overlap",
                "domain": "darkshop.onion",
                "registrar": "Synthetic Registrar Ltd",
                "associated_email": "shadowking@demo-mail.example"
            }
        ]

mock_osint = MockOSINTProvider()
