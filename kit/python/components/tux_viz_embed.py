"""
TuxVizEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxVizEmbed:
    src: str = None
    provider: str = "generic"
    title: str = None
    eyebrow: str = None
    ratio: str = "16/9"
    sandbox: str = None
    referrerpolicy: str = "strict-origin-when-cross-origin"
    open_in_new: bool = true
    poster_src: str = None
    poster_alt: str = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-viz-embed">{content}</figure>'
