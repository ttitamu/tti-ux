"""
TuxChartArea — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartArea:
    labels: str = None
    series: str = None
    width: int = 640
    height: int = 280
    variant: str = overlay
    markers: bool = false
    end_labels: bool = true
    legend: bool = false
    gridlines: bool = true
    ticks: int = 5
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"
    units: str = "undefined"
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-area">{content}</figure>'
