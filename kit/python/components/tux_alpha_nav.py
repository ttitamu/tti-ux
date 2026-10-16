"""
TuxAlphaNav — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlphaNav:
    letters: Optional[str] = None
    available: Optional[str] = None
    mode: str = "anchor"
    sticky: bool = False
    show_all: bool = False
    model_value: Optional[str] = None
    aria_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-alpha-nav">{content}</nav>'
