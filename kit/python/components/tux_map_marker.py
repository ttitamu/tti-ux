"""
TuxMapMarker — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapMarker:
    kind: str = None
    number: str = undefined
    tone_index: int = undefined
    size: str = md
    title: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<svg class="tux-map-marker">{content}</svg>'
