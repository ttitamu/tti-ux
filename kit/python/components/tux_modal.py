"""
TuxModal — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxModal:
    open: bool = False
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    size: Optional[str] = None
    variant: str = "standard"

    def render_html(self, content: str = "") -> str:
        return f'<UModal class="tux-modal">{content}</UModal>'
