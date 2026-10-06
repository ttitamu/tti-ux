"""
TuxChartFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartFrame:
    eyebrow: str = None
    title: str = None
    subtitle: str = None
    source: str = None
    notes: str = None
    bare: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-frame">{content}</figure>'
