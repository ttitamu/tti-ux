"""
TuxFAB — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFAB:
    icon: str = None
    extended: bool = false
    size: str = md
    side: str = right
    aria_label: str = "undefined"
    disabled: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<button class="tux-fab">{content}</button>'
