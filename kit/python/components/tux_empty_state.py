"""
TuxEmptyState — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEmptyState:
    kind: str = None
    icon: str = None
    title: str = None
    description: str = None
    no_card: bool = false
    compact: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-empty-state">{content}</div>'
