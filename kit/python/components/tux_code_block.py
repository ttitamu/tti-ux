"""
TuxCodeBlock — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCodeBlock:
    code: str = None
    lang: str = text
    filename: str = "undefined"
    line_numbers: bool = false
    no_copy: bool = false
    no_download: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-code-block">{content}</figure>'
