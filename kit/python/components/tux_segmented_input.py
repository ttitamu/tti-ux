"""
TuxSegmentedInput — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSegmentedInput:
    model_value: Optional[str] = None
    segments: Optional[str] = None
    separator: str = "-"
    label: Optional[str] = None
    help_text: Optional[str] = None
    uppercase: bool = True
    disabled: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-segmented-input">{content}</div>'
