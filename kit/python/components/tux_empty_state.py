"""
TuxEmptyState — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEmptyState:
    kind: Optional[str] = None
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    no_card: bool = False
    compact: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-empty-state">{content}</div>'
