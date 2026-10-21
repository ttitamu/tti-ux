"""
TuxAbstract — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAbstract:
    background: Optional[str] = None
    methods: Optional[str] = None
    results: Optional[str] = None
    conclusion: Optional[str] = None
    keywords: Optional[str] = None
    variant: str = "structured"
    level: int = 4
    plain_summary: Optional[str] = None
    policy_takeaways: Optional[str] = None
    doi: Optional[str] = None
    project_number: Optional[str] = None
    citation: Optional[str] = None
    division: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-abstract">{content}</section>'
