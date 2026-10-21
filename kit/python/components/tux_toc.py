"""
TuxTOC — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTOC:
    items: Optional[str] = None
    target: str = "article"
    levels: Optional[str] = None
    title: str = "On this page"
    no_title: bool = False
    variant: str = "comm"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-toc">{content}</nav>'
