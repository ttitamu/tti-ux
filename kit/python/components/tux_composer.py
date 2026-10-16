"""
TuxComposer — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxComposer:
    model_value: str = None
    placeholder: str = None
    models: str = None
    model_id: str = None
    max_length: int = 32000
    hint: str = None
    hide_attach: bool = false
    attach_label: str = None
    attach_icon: str = "lucide:plus"
    cancelable: bool = false
    cancel_label: str = "Cancel"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-composer">{content}</div>'
