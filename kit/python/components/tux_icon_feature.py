"""
TuxIconFeature — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxIconFeature:
    items: Optional[str] = None
    layout: str = "grid"
    columns: int = 3

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-icon-feature">{content}</ul>'
