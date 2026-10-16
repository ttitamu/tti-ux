"""
TuxComposer — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxComposer:
    model_value: Optional[str] = None
    placeholder: Optional[str] = None
    models: Optional[str] = None
    model_id: Optional[str] = None
    max_length: int = 32000
    hint: Optional[str] = None
    hide_attach: bool = False
    attach_label: Optional[str] = None
    attach_icon: str = "lucide:plus"
    cancelable: bool = False
    cancel_label: str = "Cancel"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-composer">{content}</div>'
