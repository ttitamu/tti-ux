"""
TuxChartFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartFrame:
    eyebrow: str = ""
    title: str = ""
    subtitle: str = ""
    source: str = ""
    notes: str = ""
    bare: bool = False
    labels: Optional[str] = None
    series: Optional[str] = None
    sonify: bool = True
    show_data_table: bool = True
    division: Optional[str] = None
    doi: str = ""

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-frame">{content}</figure>'
