"""
TuxMapEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapEmbed:
    src: Optional[str] = None
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    source: Optional[str] = None
    aspect: str = "16/9"
    height: Optional[int] = None
    iframe_title: Optional[str] = None
    attribution: bool = True
    skeleton: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-map-embed">{content}</figure>'
