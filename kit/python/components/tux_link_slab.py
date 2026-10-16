"""
TuxLinkSlab — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLinkSlab:
    links: Optional[str] = None
    tone: str = "plain"
    aria_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-link-slab">{content}</nav>'
