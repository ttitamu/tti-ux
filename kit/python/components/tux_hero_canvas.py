"""
TuxHeroCanvas — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxHeroCanvas:
    variant: str = "wash"
    blend: str = "seamless"
    interactive: bool = True
    show_controls: bool = True
    min_height: str = "32rem"

    def render_html(self, content: str = "") -> str:
        return f'<TuxHeroCanvasSol class="tux-hero-canvas">{content}</TuxHeroCanvasSol>'
