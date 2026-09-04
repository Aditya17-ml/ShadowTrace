from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_correlation():
    response = client.post("/api/investigations/INV-001/analyze")
    assert response.status_code == 200
    data = response.json()
    assert "confidence_score" in data
    assert data["confidence_score"] > 0
    assert "factors" in data
