"""
TuxKeyValueInput — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxKeyValueInput:
    model_value: Optional[str] = None
    schema: Optional[str] = None
    strict_keys: bool = False
    key_placeholder: str = "key"
    value_placeholder: str = "value"
    add_label: str = "Add attribute"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-key-value-input">{content}</div>'
