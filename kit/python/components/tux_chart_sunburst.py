"""
TuxChartSunburst — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartSunburst:
    data: Optional[str] = None
    size: int = 320
    center_label: str = "Total"
    format_total: Optional[str] = None
    format_value: Optional[str] = None
    show_legend: bool = True
    palette: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chart-sunburst">{content}</div>'
