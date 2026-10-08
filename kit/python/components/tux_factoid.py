"""
TuxFactoid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFactoid:
    items: Optional[str] = None
    variant: str = "default"
    columns: str = "3"
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    dek: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-factoid">{content}</section>'
