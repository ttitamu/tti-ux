"""
TuxCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCard:
    to: Optional[str] = None
    padded: bool = True
    linked: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<NuxtLink class="tux-card">{content}</NuxtLink>'
