"""
TuxInlineCitation — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxInlineCitation:
    n: int = None
    title: str = None
    href: str = "undefined"
    excerpt: str = "undefined"
    score: str = undefined
    label: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<UPopover class="tux-inline-citation">{content}</UPopover>'
