"""
TuxToolCall — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxToolCall:
    verb: Optional[str] = None
    arg: Optional[str] = None
    status: str = "completed"
    elapsed_ms: Optional[int] = None
    diff: Optional[str] = None
    icon: Optional[str] = None
    default_open: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-tool-call">{content}</div>'
