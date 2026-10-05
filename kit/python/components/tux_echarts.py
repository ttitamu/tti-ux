"""
TuxECharts — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxECharts:
    options: str = None
    height: str = "380px"
    width: str = "100%"
    aria_title: str = "Interactive"
    aria_summary: str = None
    extensions: str = None
    maps: str = None
    loading: bool = false
    not_merge: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-echarts">{content}</div>'
