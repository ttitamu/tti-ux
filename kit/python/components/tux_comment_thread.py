"""
TuxCommentThread — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCommentThread:
    model_value: str = None
    authors: str = None
    current_user: str = None
    hide_resolved: bool = true
    size: str = md

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-comment-thread">{content}</div>'
