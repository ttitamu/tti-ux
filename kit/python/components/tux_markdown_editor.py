"""
TuxMarkdownEditor — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMarkdownEditor:
    model_value: Optional[str] = None
    rows: int = 12
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    placeholder: str = "Write"
    preview: bool = True
    disabled: bool = False
    aria_label: str = "Markdown"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-markdown-editor">{content}</div>'
