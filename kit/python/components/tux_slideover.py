"""
TuxSlideover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSlideover:
    side: str = "right"
    size: Optional[str] = None
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    show_close: bool = True
    close_on_backdrop: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<dialog class="tux-slideover">{content}</dialog>'
