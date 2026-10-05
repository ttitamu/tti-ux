"""
TuxChartHeatmap — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartHeatmap:
    rows: str = None
    cols: str = None
    values: str = None
    width: int = 640
    height: int = 280
    ramp: str = maroon
    bins: str = 5
    value_labels: bool = false
    legend: bool = true
    col_label_every: int = 0
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"
    units: str = "undefined"
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-heatmap">{content}</figure>'
