"""
TuxAlphaNav — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlphaNav:
    letters: str = None
    available: str = None
    mode: str = "anchor"
    sticky: bool = false
    show_all: bool = false
    model_value: str = None
    aria_label: str = None

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-alpha-nav">{content}</nav>'
