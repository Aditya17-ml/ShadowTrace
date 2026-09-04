from typing import List, Dict, Any
from app.providers.base import BaseIntelligenceProvider

class MockDarkWebProvider(BaseIntelligenceProvider):
    def fetch_data(self, query: str) -> List[Dict[str, Any]]:
        return [
            {
                "source": "Synthetic Darknet Forum",
                "marketplace": "ShadowMarket (Demo)",
                "actor": "ShadowKing",
                "content": "Selling database dump. Contact PGP DEMO-8F42 or jabber alpha_1337",
                "timestamp": "2026-08-05T11:20:00Z"
            }
        ]

mock_darkweb = MockDarkWebProvider()
