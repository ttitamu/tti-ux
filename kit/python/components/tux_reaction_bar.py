"""
TuxReactionBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReactionBar:
    model_value: str = "()"
    reactions: str = "()"
    counts: str = "()"
    size: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-reaction-bar">{content}</div>'
