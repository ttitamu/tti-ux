"""
TuxChartDonut — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartDonut:
    slices: Optional[str] = None
    size: int = 280
    thickness: int = 0.5
    slice_labels: bool = True
    legend: bool = False
    center_label: Optional[str] = None
    center_value: Optional[str] = None
    min_slice: int = 3
    format: str = "(n:"
    decimals: int = 1
    aria_summary: Optional[str] = None
    units: Optional[str] = None
    tooltip: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-donut">{content}</figure>'
