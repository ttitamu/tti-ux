"""
TuxSectionHeader — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSectionHeader:
    level: int = 2
    title: Optional[str] = None
    secondary_title: Optional[str] = None
    subtitle: Optional[str] = None
    kicker: Optional[str] = None
    variant: str = "institutional"
    division: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-section-header">{content}</header>'
