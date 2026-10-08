"""
TuxMapMarker — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapMarker:
    kind: Optional[str] = None
    number: Optional[str] = None
    tone_index: Optional[int] = None
    size: str = "md"
    title: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-map-marker">{content}</svg>'
