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
    level: str = "4"

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-abstract">{content}</section>'
