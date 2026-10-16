"""
TuxCaptionedMedia — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCaptionedMedia:
    src: str = None
    alt: str = None
    caption: str = None
    credit: str = None
    eyebrow: str = None
    aspect: str = "16/9"
    align: str = "full"
    tone: str = "maroon"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-captioned-media">{content}</figure>'
