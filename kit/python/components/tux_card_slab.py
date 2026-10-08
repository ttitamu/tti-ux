"""
TuxCardSlab — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCardSlab:
    cards: Optional[str] = None
    columns: str = "3"
    aspect: str = "4/5"
    heading: Optional[str] = None
    eyebrow: Optional[str] = None
    inset: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-card-slab">{content}</section>'
