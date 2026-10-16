"""
TuxChartGeographic — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeographic:
    kind: str = None
    palette: str = "maroon"
    title: str = None
    legend_label: str = "Value"
    legend_stops: str = None
    show_legend: bool = true
    counties: str = None
    districts: str = None
    states: str = None
    highlight: str = "TX"
    dots: int = 600
    dot_legend: str = None
    flows: str = None
    flow_legend: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chart-geographic">{content}</div>'
