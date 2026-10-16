"""
TuxContextMeter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContextMeter:
    used: Optional[int] = None
    max: Optional[int] = None
    breakdown: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-context-meter">{content}</div>'
