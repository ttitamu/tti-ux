"""
TuxFormField — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFormField:
    label: str = None
    help: str = "undefined"
    hint: str = "undefined"
    error: str = "undefined"
    required: bool = false
    input_id: str = "undefined"
    layout: str = stacked

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-form-field">{content}</div>'
