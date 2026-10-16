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
    palette: str = "brand"
    patterns: bool = false
    thickness: int = 0.5
    slice_labels: bool = true
    legend: bool = false
    center_label: str = None
    center_value: str = None
    min_slice: int = 3
    format: str = None
    decimals: int = 1
    aria_summary: str = None
    units: str = None
    tooltip: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-donut">{content}</figure>'
