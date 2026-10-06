"""
TuxChartBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartBar:
    labels: str = None
    series: str = None
    width: int = 640
    height: int = 280
    orientation: str = vertical
    variant: str = grouped
    value_labels: bool = true
    in_bar_labels: bool = false
    gridlines: bool = true
    legend: bool = false
    ticks: int = 5
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"
    units: str = "undefined"
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-bar">{content}</figure>'
