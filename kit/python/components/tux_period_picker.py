"""
TuxPeriodPicker — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPeriodPicker:
    model_value: Optional[str] = None
    presets: Optional[str] = None
    label: Optional[str] = None
    allow_compare: bool = True
    step_days: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-period-picker">{content}</div>'
