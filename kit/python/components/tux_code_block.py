"""
TuxCodeBlock — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCodeBlock:
    code: Optional[str] = None
    lang: str = "text"
    filename: Optional[str] = None
    line_numbers: bool = False
    no_copy: bool = False
    no_download: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-code-block">{content}</figure>'
