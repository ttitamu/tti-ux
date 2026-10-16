"""
TuxChartArea — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartArea:
    labels: Optional[str] = None
    series: Optional[str] = None
    width: int = 640
    height: int = 280
    palette: str = "brand"
    patterns: bool = False
    variant: str = "overlay"
    markers: bool = False
    end_labels: bool = True
    legend: bool = False
    gridlines: bool = True
    ticks: int = 5
    format: Optional[str] = None
    decimals: int = 1
    aria_summary: Optional[str] = None
    units: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-area">{content}</figure>'
