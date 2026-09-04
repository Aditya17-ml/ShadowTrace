from typing import Dict, Any

class MockAIProvider:
    def generate_actor_summary(self, actor_name: str, aliases: list, confidence: int) -> str:
        alias_str = ", ".join([f"'{a}'" for a in aliases]) if aliases else f"'{actor_name.lower()}'"
        return (
            f"Automated AI Intelligence Synthesis for '{actor_name}':\n\n"
            f"Multi-source correlation suggests that the synthetic aliases {alias_str} "
            f"demonstrate significant operational overlap across synthetic forum posts, domain infrastructure, "
            f"and synthetic cryptocurrency transfers.\n\n"
            f"Primary correlation driver: PGP fingerprint reuse (DEMO-8F42) coupled with temporal clustering. "
            f"Current confidence score: {confidence}%. This finding constitutes an investigative hypothesis "
            f"and requires formal analyst validation before operational deployment."
        )

    def generate_timeline_summary(self, event_count: int) -> str:
        return (
            f"Timeline Analysis: Analyzed {event_count} chronological synthetic events spanning from 2026-08-01 to 2026-09-02. "
            f"The activity shows account creation followed by PGP key registration and multi-hop crypto routing within 14 days."
        )

mock_ai = MockAIProvider()
