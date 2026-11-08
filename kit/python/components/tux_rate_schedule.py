"""
TuxRateSchedule — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRateSchedule:
    title: str = "Effective-Dated Rate Schedule"
    subtitle: Optional[str] = None
    items: Optional[str] = None
    currency_symbol: str = "$"
    sample_quantity: int = 100
    editable: bool = True
    status_filter: str = "all"

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-rate-schedule">{content}</section>'
