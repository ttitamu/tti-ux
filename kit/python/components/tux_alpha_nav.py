"""
TuxAlphaNav — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlphaNav:
    letters: str = "()"
    available: str = "undefined"
    mode: str = anchor
    sticky: bool = false
    show_all: bool = false
    model_value: str = null
    aria_label: str = "Jump"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-alpha-nav">{content}</nav>'
