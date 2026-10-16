"""
TuxChartSunburst — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartSunburst:
    data: str = None
    size: int = 320
    center_label: str = "Total"
    format_total: str = None
    format_value: str = None
    show_legend: bool = true
    palette: str = None
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chart-sunburst">{content}</div>'
