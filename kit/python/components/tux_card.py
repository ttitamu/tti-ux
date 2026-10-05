"""
TuxCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCard:
    to: str = "undefined"
    padded: bool = true
    linked: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<NuxtLink class="tux-card">{content}</NuxtLink>'
