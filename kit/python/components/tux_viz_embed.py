"""
TuxVizEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxVizEmbed:
    src: Optional[str] = None
    provider: str = "generic"
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    ratio: str = "16/9"
    sandbox: Optional[str] = None
    referrerpolicy: str = "strict-origin-when-cross-origin"
    open_in_new: bool = True
    poster_src: Optional[str] = None
    poster_alt: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-viz-embed">{content}</figure>'
