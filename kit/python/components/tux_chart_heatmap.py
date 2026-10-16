"""
TuxChartHeatmap — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartHeatmap:
    rows: Optional[str] = None
    cols: Optional[str] = None
    values: Optional[str] = None
    width: int = 640
    height: int = 280
    ramp: str = "maroon"
    bins: int = 5
    value_labels: bool = False
    legend: bool = True
    col_label_every: int = 0
    format: Optional[str] = None
    decimals: int = 1
    aria_summary: Optional[str] = None
    units: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-heatmap">{content}</figure>'
