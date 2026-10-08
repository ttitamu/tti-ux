"""
TuxInlineCitation — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxInlineCitation:
    n: Optional[int] = None
    title: Optional[str] = None
    href: Optional[str] = None
    excerpt: Optional[str] = None
    score: Optional[str] = None
    label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<UPopover class="tux-inline-citation">{content}</UPopover>'
