from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_actors():
    response = client.get("/api/actors")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_get_actor_detail():
    response = client.get("/api/actors/1")
    assert response.status_code == 200
    data = response.json()
    assert "actor" in data
    assert data["actor"]["name"] == "ShadowKing"
