"""
TuxFormField — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFormField:
    label: Optional[str] = None
    help: Optional[str] = None
    hint: Optional[str] = None
    error: Optional[str] = None
    required: bool = False
    input_id: Optional[str] = None
    layout: str = "stacked"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-form-field">{content}</div>'
