"""
TuxReasoning — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReasoning:
    duration: int = 3.4
    tokens_per_sec: Optional[int] = None
    default_open: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-reasoning">{content}</div>'
