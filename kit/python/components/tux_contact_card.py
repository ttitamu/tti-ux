"""
TuxContactCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContactCard:
    name: Optional[str] = None
    role: Optional[str] = None
    affiliation: Optional[str] = None
    credentials: Optional[str] = None
    image: Optional[str] = None
    initial: Optional[str] = None
    tone: str = "maroon"
    contacts: str = "()"
    layout: str = "vertical"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-contact-card">{content}</article>'
