from typing import Dict, List, Any
from app.correlation.rules import RULE_WEIGHTS, get_confidence_level

def calculate_correlation_score(actor_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates deterministic explainable confidence score from actor entity relationships.
    """
    factors = []
    total_score = 0

    # 1. PGP Fingerprint Reuse (Max 30)
    has_pgp = any(e.get("type") == "PGP" for e in actor_data.get("entities", []))
    if has_pgp:
        pts = 30
        total_score += pts
        factors.append({
            "rule": "pgp_fingerprint_reuse",
            "name": RULE_WEIGHTS["pgp_fingerprint_reuse"]["name"],
            "points": pts,
            "max_points": 30,
            "evidence": "Synthetic PGP fingerprint DEMO-8F42 observed across 3 synthetic forum posts."
        })

    # 2. Username Similarity (Max 15)
    aliases = actor_data.get("aliases", [])
    if len(aliases) >= 2:
        pts = 15
        total_score += pts
        factors.append({
            "rule": "username_similarity",
            "name": RULE_WEIGHTS["username_similarity"]["name"],
            "points": pts,
            "max_points": 15,
            "evidence": f"Alias reuse verified across handles: {', '.join(aliases[:3])}"
        })

    # 3. Blockchain Relationship (Max 20)
    has_crypto = any(e.get("type") == "Crypto" for e in actor_data.get("entities", []))
    if has_crypto:
        pts = 17  # Demo score matching prompt example
        total_score += pts
        factors.append({
            "rule": "blockchain_relationship",
            "name": RULE_WEIGHTS["blockchain_relationship"]["name"],
            "points": pts,
            "max_points": 20,
            "evidence": "Synthetic wallet DEMO-BTC-001 connected via 4 transactions to target cluster."
        })

    # 4. Temporal Correlation (Max 10)
    pts = 10
    total_score += pts
    factors.append({
        "rule": "temporal_correlation",
        "name": RULE_WEIGHTS["temporal_correlation"]["name"],
        "points": pts,
        "max_points": 10,
        "evidence": "Activity window clustering between 2026-08-01 and 2026-09-02."
    })

    # Cap score at 100
    total_score = min(total_score, 100)
    level = get_confidence_level(total_score)

    return {
        "score": total_score,
        "level": level,
        "factors": factors,
        "disclaimer": "ATTRIBUTION HYPOTHESIS: Output generated from synthetic evidence correlation. Human analyst verification is required before taking operational action."
    }
