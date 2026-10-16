"""
TuxSectionHeader — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSectionHeader:
    level: int = 2
    title: str = None
    secondary_title: str = None
    subtitle: str = None
    kicker: str = None
    variant: str = "institutional"

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-section-header">{content}</header>'
