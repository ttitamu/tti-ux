"""
TuxCardCarousel — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCardCarousel:
    items: str = "undefined"
    eyebrow: str = "undefined"
    title: str = "undefined"
    bare: bool = false
    arrows: bool = true
    dots: bool = false
    loop: bool = false
    slides_to_scroll: int = 1
    align: str = start
    gap: str = "1rem"
    aria_label: str = "Carousel"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-card-carousel">{content}</div>'
