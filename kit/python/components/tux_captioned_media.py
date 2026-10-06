"""
TuxCaptionedMedia — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCaptionedMedia:
    src: str = "undefined"
    alt: str = None
    caption: str = "undefined"
    credit: str = "undefined"
    eyebrow: str = "undefined"
    aspect: str = 16/9
    align: str = full
    tone: str = maroon

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-captioned-media">{content}</figure>'
