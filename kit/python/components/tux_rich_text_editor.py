"""
TuxRichTextEditor — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRichTextEditor:
    model_value: Optional[str] = None
    placeholder: Optional[str] = None
    disabled: bool = False
    min_height: str = "12rem"
    max_height: str = "auto"
    toolbar: Optional[str] = None
    heading_levels: Optional[str] = None
    show_count: bool = True
    fullscreenable: bool = True
    aria_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rich-text-editor">{content}</div>'
