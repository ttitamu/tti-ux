"""
TuxPaperMeta — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPaperMeta:
    doi: Optional[str] = None
    license: Optional[str] = None
    funders: Optional[str] = None
    published: Optional[str] = None
    version: Optional[str] = None
    type: Optional[str] = None
    pages: Optional[str] = None
    venue: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<dl class="tux-paper-meta">{content}</dl>'
