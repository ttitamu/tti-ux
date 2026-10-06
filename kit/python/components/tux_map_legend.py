"""
TuxMapLegend — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapLegend:
    title: str = "undefined"
    eyebrow: str = "undefined"
    entries: str = "undefined"
    layout: str = stacked
    gradient: str = "undefined"
    min_label: str = None
    max_label: str = None
    css: str = None
    stops: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-map-legend">{content}</div>'
