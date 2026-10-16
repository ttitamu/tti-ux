"""
TuxAlert — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlert:
    variant: str = "info"
    title: str = None
    description: str = None
    icon: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-alert">{content}</div>'
