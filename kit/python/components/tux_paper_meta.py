"""
TuxPaperMeta — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPaperMeta:
    doi: str = None
    license: str = None
    funders: str = None
    published: str = None
    version: str = None
    type: str = None
    pages: str = None
    venue: str = None

    def render_html(self, content: str = "") -> str:
        return f'<dl class="tux-paper-meta">{content}</dl>'
