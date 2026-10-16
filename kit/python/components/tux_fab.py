"""
TuxFAB — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFAB:
    icon: Optional[str] = None
    extended: bool = False
    size: str = "md"
    side: str = "right"
    aria_label: Optional[str] = None
    disabled: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<button class="tux-fab">{content}</button>'
