"""
TuxMapLegend — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapLegend:
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    entries: Optional[str] = None
    layout: str = "stacked"
    gradient: Optional[str] = None
    min_label: Optional[str] = None
    max_label: Optional[str] = None
    css: Optional[str] = None
    stops: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-map-legend">{content}</div>'
