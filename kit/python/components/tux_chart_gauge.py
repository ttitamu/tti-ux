"""
TuxChartGauge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGauge:
    value: Optional[int] = None
    min: int = 0
    max: int = 100
    size: int = 240
    variant: str = "arc"
    bands: Optional[str] = None
    center_label: Optional[str] = None
    center_value: Optional[str] = None
    units: Optional[str] = None
    format: Optional[str] = None
    decimals: int = 1
    aria_summary: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-gauge">{content}</figure>'
