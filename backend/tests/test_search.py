from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_search_shadowking():
    response = client.get("/api/search?q=ShadowKing")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "ShadowKing"
    assert len(data["results"]) > 0
    first = data["results"][0]
    assert "name" in first
