"""
TuxFormField — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFormField:
    label: str = None
    help: str = None
    hint: str = None
    error: str = None
    required: bool = false
    input_id: str = None
    layout: str = "stacked"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-form-field">{content}</div>'
