"""
TuxECharts — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxECharts:
    options: Optional[str] = None
    height: str = "380px"
    width: str = "100%"
    aria_title: str = "Interactive data visualization"
    aria_summary: str = ""
    extensions: Optional[str] = None
    maps: Optional[str] = None
    loading: bool = False
    not_merge: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-echarts">{content}</div>'
