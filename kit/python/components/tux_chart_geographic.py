"""
TuxChartGeographic — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGeographic:
    kind: Optional[str] = None
    palette: str = "maroon"
    title: Optional[str] = None
    legend_label: str = "Value"
    legend_stops: Optional[str] = None
    show_legend: bool = True
    counties: Optional[str] = None
    districts: Optional[str] = None
    states: Optional[str] = None
    highlight: str = "TX"
    dots: int = 600
    dot_legend: Optional[str] = None
    flows: Optional[str] = None
    flow_legend: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chart-geographic">{content}</div>'
