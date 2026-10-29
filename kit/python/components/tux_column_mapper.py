"""
TuxColumnMapper — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxColumnMapper:
    source_columns: Optional[str] = None
    sample_rows: Optional[str] = None
    target_fields: Optional[str] = None
    model_value: Optional[str] = None
    confirm_label: str = "Apply Mapping"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-column-mapper">{content}</div>'
