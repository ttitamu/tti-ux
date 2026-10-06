"""
TuxContactCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContactCard:
    name: str = None
    role: str = "undefined"
    affiliation: str = "undefined"
    credentials: str = "undefined"
    image: str = "undefined"
    initial: str = "undefined"
    tone: str = maroon
    contacts: str = "()"
    layout: str = vertical

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-contact-card">{content}</article>'
