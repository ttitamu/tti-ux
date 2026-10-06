"""
TuxAuthorByline — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAuthorByline:
    authors: str = None
    affiliations: str = "()"
    layout: str = compact

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-author-byline">{content}</section>'
