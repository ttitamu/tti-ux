"""
TuxMapMarker — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapMarker:
    kind: str = None
    number: str = None
    tone_index: int = None
    size: str = "md"
    title: str = None

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-map-marker">{content}</svg>'
