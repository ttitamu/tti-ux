"""
TuxStatComparison — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStatComparison:
    eyebrow: Optional[str] = None
    current: Optional[int] = None
    previous: Optional[int] = None
    suffix: Optional[str] = None
    label: Optional[str] = None
    layout: str = "row"
    decimals: int = 1
    polarity: str = "direct"
    delta_format: str = "abs+pct"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-stat-comparison">{content}</div>'
