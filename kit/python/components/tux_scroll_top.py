"""
TuxScrollTop — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxScrollTop:
    threshold: int = 160
    position: str = bottom-right
    aria_label: str = "Scroll"

    def render_html(self, content: str = "") -> str:
        return f'<button class="tux-scroll-top">{content}</button>'
