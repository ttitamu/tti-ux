"""
TuxReactionBar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReactionBar:
    model_value: Optional[str] = None
    reactions: Optional[str] = None
    counts: Optional[str] = None
    size: str = "md"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-reaction-bar">{content}</div>'
