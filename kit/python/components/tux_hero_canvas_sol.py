"""
TuxHeroCanvasSol — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxHeroCanvasSol:
    blend: str = "seamless"
    interactive: bool = True
    show_controls: bool = True
    min_height: str = "34rem"
    mode: str = "adaptive"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-hero-canvas-sol">{content}</div>'
