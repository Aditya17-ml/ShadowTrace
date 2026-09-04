from typing import Dict, Any, List
import networkx as nx
from app.correlation.scoring import calculate_correlation_score

class CorrelationEngine:
    def __init__(self):
        self.graph = nx.Graph()

    def build_network_graph(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Builds NetworkX graph and returns graph metrics and layout data.
        """
        self.graph.clear()
        for node in nodes:
            self.graph.add_node(node["id"], **node)
        for edge in edges:
            self.graph.add_edge(edge["source"], edge["target"], weight=edge.get("confidence", 50))

        density = nx.density(self.graph) if len(self.graph) > 0 else 0
        centrality = nx.degree_centrality(self.graph) if len(self.graph) > 0 else {}

        return {
            "node_count": self.graph.number_of_nodes(),
            "edge_count": self.graph.number_of_edges(),
            "density": round(density, 4),
            "centrality": {k: round(v, 4) for k, v in centrality.items()},
            "nodes": nodes,
            "edges": edges
        }

    def analyze_actor(self, actor_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs complete correlation analysis pipeline for threat actor.
        """
        score_data = calculate_correlation_score(actor_data)
        graph_data = self.build_network_graph(
            actor_data.get("nodes", []),
            actor_data.get("edges", [])
        )
        return {
            "actor_id": actor_data.get("id"),
            "actor_name": actor_data.get("name"),
            "confidence_score": score_data["score"],
            "confidence_level": score_data["level"],
            "factors": score_data["factors"],
            "graph_metrics": graph_data,
            "disclaimer": score_data["disclaimer"]
        }

correlation_engine = CorrelationEngine()
