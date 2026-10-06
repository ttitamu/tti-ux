"""
TuxSlideover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSlideover:
    side: str = right
    size: str = "undefined"
    title: str = "undefined"
    eyebrow: str = "undefined"
    show_close: bool = true
    close_on_backdrop: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<dialog class="tux-slideover">{content}</dialog>'
