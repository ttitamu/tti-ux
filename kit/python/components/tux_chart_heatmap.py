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
    ramp: str = "maroon"
    bins: int = 5
    value_labels: bool = false
    legend: bool = true
    col_label_every: int = 0
    format: str = None
    decimals: int = 1
    aria_summary: str = None
    units: str = None
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-heatmap">{content}</figure>'
