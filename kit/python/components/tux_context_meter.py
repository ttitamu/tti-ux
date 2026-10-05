"""
TuxContextMeter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContextMeter:
    used: int = None
    max: int = None
    breakdown: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<UPopover class="tux-context-meter">{content}</UPopover>'
