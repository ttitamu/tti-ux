"""
TuxContactCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContactCard:
    name: str = None
    role: str = None
    affiliation: str = None
    credentials: str = None
    image: str = None
    initial: str = None
    tone: str = "maroon"
    contacts: str = None
    layout: str = "vertical"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-contact-card">{content}</article>'
