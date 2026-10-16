"""
TuxFactoid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFactoid:
    items: str = None
    variant: str = "default"
    columns: int = 3
    eyebrow: str = None
    title: str = None
    dek: str = None

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-factoid">{content}</section>'
