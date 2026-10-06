"""
TuxChartGauge — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChartGauge:
    value: int = None
    min: int = 0
    max: int = 100
    size: int = 240
    variant: str = arc
    bands: str = "()"
    center_label: str = "undefined"
    center_value: str = undefined
    units: str = "undefined"
    format: str = "(n:"
    decimals: int = 1
    aria_summary: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-chart-gauge">{content}</figure>'
