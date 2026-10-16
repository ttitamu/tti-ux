"""
TuxAlert — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlert:
    variant: str = "info"
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-alert">{content}</div>'
