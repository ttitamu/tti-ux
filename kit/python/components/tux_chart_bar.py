"""
TuxChartBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartBar:
    labels: Optional[str] = None
    series: Optional[str] = None
    width: int = 640
    height: int = 280
    palette: str = "brand"
    patterns: bool = False
    orientation: str = "vertical"
    variant: str = "grouped"
    value_labels: bool = True
    in_bar_labels: bool = False
    gridlines: bool = True
    legend: bool = False
    ticks: int = 5
    format: Optional[str] = None
    decimals: int = 1
    aria_summary: Optional[str] = None
    units: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-bar">{content}</figure>'
