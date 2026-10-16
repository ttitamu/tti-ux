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
    href: str = None
    excerpt: str = None
    score: str = None
    label: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-inline-citation">{content}</div>'
