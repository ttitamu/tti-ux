"""
TuxMapEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapEmbed:
    src: str = None
    eyebrow: str = None
    title: str = None
    subtitle: str = None
    source: str = None
    aspect: str = "16/9"
    height: int = None
    iframe_title: str = None
    attribution: bool = true
    skeleton: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-map-embed">{content}</figure>'
