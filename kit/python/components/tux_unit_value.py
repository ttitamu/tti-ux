"""
TuxUnitValue — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxUnitValue:
    value: Optional[int] = None
    unit: Optional[str] = None
    ci: Optional[int] = None
    decimals: Optional[int] = None
    label: str = ""
    station: str = ""
    variant: str = "inline"
    interactive: bool = False
    system: Optional[str] = None
    division: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-unit-value">{content}</span>'
