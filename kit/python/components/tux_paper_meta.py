"""
TuxPaperMeta — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPaperMeta:
    doi: str = "undefined"
    license: str = "undefined"
    funders: str = "undefined"
    published: str = "undefined"
    version: str = "undefined"
    type: str = "undefined"
    pages: str = "undefined"
    venue: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<dl class="tux-paper-meta">{content}</dl>'
