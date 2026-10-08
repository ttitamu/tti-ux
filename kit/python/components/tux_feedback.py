"""
TuxFeedback — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFeedback:
    page_id: Optional[str] = None
    title: str = "Was"
    endpoint: str = "/api/feedback"
    allow_details: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-feedback">{content}</section>'
