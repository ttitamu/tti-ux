"""
TuxAbstract — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAbstract:
    background: str = None
    methods: str = None
    results: str = None
    conclusion: str = None
    keywords: str = None
    variant: str = "structured"
    level: int = 4

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-abstract">{content}</section>'
