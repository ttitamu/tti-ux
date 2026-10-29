"""
TuxThresholdBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxThresholdBar:
    title: Optional[str] = None
    segments: Optional[str] = None
    limit: Optional[int] = None
    unit: str = ""
    unit_position: str = "suffix"
    decimals: int = 1
    warning_ratio: float = 0.85
    show_legend: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-threshold-bar">{content}</div>'
