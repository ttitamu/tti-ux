"""
TuxChartFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartFrame:
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    bare: bool = False
    labels: Optional[str] = None
    series: Optional[str] = None
    sonify: bool = True
    show_data_table: bool = True
    division: Optional[str] = None
    doi: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-frame">{content}</figure>'
