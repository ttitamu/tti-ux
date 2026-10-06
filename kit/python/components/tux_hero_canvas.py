"""
TuxHeroCanvas — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxHeroCanvas:
    variant: str = wash
    blend: str = seamless
    interactive: bool = true
    show_controls: bool = true
    min_height: str = "32rem"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-hero-canvas">{content}</div>'
