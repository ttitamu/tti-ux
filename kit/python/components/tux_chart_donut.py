"""
TuxChartDonut — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartDonut:
    slices: str = None
    size: int = 280
    thickness: int = 0.5
    slice_labels: bool = true
    legend: bool = false
    center_label: str = "undefined"
    center_value: str = undefined
    min_slice: int = 3
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"
    units: str = "undefined"
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-donut">{content}</figure>'
