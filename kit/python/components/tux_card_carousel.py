"""
TuxCardCarousel — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCardCarousel:
    items: Optional[str] = None
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    bare: bool = False
    arrows: bool = True
    dots: bool = False
    loop: bool = False
    slides_to_scroll: int = 1
    align: str = "start"
    gap: str = "1rem"
    aria_label: str = "Carousel"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-card-carousel">{content}</div>'
