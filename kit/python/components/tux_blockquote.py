"""
TuxBlockquote — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBlockquote:
    quote: Optional[str] = None
    attribution: Optional[str] = None
    role: Optional[str] = None
    layout: str = "centered"
    variant: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-blockquote">{content}</figure>'
