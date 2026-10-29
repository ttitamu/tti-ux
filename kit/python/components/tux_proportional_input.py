"""
TuxProportionalInput — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxProportionalInput:
    model_value: Optional[str] = None
    target_total: int = 100
    unit: str = "%"
    decimals: int = 1
    step: int = 1
    title: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-proportional-input">{content}</div>'
