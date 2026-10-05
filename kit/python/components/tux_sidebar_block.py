"""
TuxSidebarBlock — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSidebarBlock:
    title: str = None
    eyebrow: str = "undefined"
    icon: str = "undefined"
    variant: str = default

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-sidebar-block">{content}</section>'
