from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseIntelligenceProvider(ABC):
    @abstractmethod
    def fetch_data(self, query: str) -> List[Dict[str, Any]]:
        pass
