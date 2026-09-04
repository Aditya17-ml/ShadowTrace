from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_investigations():
    response = client.get("/api/investigations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_investigation_graph():
    response = client.get("/api/investigations/INV-001/graph")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
