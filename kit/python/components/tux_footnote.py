"""
TuxFootnote — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFootnote:
    n: int = None
    text: str = None
    id_prefix: str = "fn"

    def render_html(self, content: str = "") -> str:
        return f'<UPopover class="tux-footnote">{content}</UPopover>'
