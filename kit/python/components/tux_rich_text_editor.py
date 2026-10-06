"""
TuxRichTextEditor — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRichTextEditor:
    model_value: str = None
    placeholder: str = "Start"
    disabled: bool = false
    min_height: str = "12rem"
    max_height: str = "auto"
    toolbar: str = ()
    heading_levels: str = ()
    show_count: bool = true
    fullscreenable: bool = true
    aria_label: str = "Rich"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rich-text-editor">{content}</div>'
