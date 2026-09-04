# Correlation scoring rules and weight definitions

RULE_WEIGHTS = {
    "pgp_fingerprint_reuse": {
        "max_score": 30,
        "name": "PGP Fingerprint Match",
        "description": "Identical PGP key fingerprint associated across synthetic profiles."
    },
    "blockchain_relationship": {
        "max_score": 20,
        "name": "Blockchain Transaction Relationship",
        "description": "Synthetic wallet transaction graph link and flow analysis."
    },
    "username_similarity": {
        "max_score": 15,
        "name": "Username / Alias Similarity",
        "description": "Syntactic & lexical similarity across forum handles (e.g. shadowking / alpha_1337)."
    },
    "domain_relationship": {
        "max_score": 15,
        "name": "Domain / Infrastructure Relationship",
        "description": "Shared registration or synthetic hidden service hosting overlap."
    },
    "temporal_correlation": {
        "max_score": 10,
        "name": "Temporal Activity Correlation",
        "description": "Overlapping timestamps across synthetic activity logs."
    },
    "document_metadata": {
        "max_score": 10,
        "name": "Document Metadata Overlap",
        "description": "Shared EXIF, author string, or software version metadata."
    }
}

def get_confidence_level(score: int) -> str:
    if score <= 30:
        return "LOW"
    elif score <= 60:
        return "MEDIUM"
    elif score <= 80:
        return "HIGH"
    else:
        return "VERY HIGH"
