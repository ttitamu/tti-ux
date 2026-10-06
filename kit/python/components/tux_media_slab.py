"""
TuxMediaSlab — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMediaSlab:
    src: str = "undefined"
    alt: str = None
    eyebrow: str = "undefined"
    title: str = None
    dek: str = "undefined"
    layout: str = overlay
    image_side: str = right
    height: str = standard
    tone: str = maroon

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-media-slab">{content}</section>'
