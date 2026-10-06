"""
TuxMapEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMapEmbed:
    src: str = "undefined"
    eyebrow: str = "undefined"
    title: str = "undefined"
    subtitle: str = "undefined"
    source: str = "undefined"
    aspect: str = 16/9
    height: int = undefined
    iframe_title: str = "undefined"
    attribution: bool = true
    skeleton: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-map-embed">{content}</figure>'
