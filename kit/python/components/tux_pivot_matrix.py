"""
TuxPivotMatrix — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPivotMatrix:
    caption: Optional[str] = None
    row_labels: Optional[str] = None
    col_labels: Optional[str] = None
    values: Optional[str] = None
    row_header_label: str = "Category"
    value_prefix: str = ""
    value_suffix: str = ""
    decimals: int = 0
    shaded: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-pivot-matrix">{content}</div>'
