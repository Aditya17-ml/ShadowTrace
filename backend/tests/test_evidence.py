from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_evidence_verification():
    response = client.get("/api/evidence/EV-00123/verify")
    assert response.status_code == 200
    data = response.json()
    assert "integrity" in data
    assert data["integrity"] == "VERIFIED"
