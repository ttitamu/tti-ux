"""
TuxChartHistogram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartHistogram:
    values: str = None
    width: int = 640
    height: int = 280
    bin_count: int = 12
    percentiles: str = "()"
    normalize: bool = false
    gridlines: bool = true
    ticks: int = 5
    x_label: str = "undefined"
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"
    units: str = "undefined"
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-histogram">{content}</figure>'
