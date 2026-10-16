"""
TuxMapLegend — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapLegend:
    title: str = None
    eyebrow: str = None
    entries: str = None
    layout: str = "stacked"
    gradient: str = None
    min_label: str = None
    max_label: str = None
    css: str = None
    stops: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-map-legend">{content}</div>'
