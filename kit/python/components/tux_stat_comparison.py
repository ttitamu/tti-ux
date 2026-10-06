"""
TuxStatComparison — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStatComparison:
    eyebrow: str = "undefined"
    current: int = None
    previous: int = None
    suffix: str = "undefined"
    label: str = "undefined"
    layout: str = row
    decimals: int = 1
    polarity: str = direct
    delta_format: str = abs+pct

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-stat-comparison">{content}</div>'
