"""
TuxSplitPane — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSplitPane:
    model_value: Optional[str] = None
    initial_list_width: str = "320px"
    min_list_width: int = 220
    max_list_width: int = 560
    id: Optional[str] = None
    initial_bottom_height: str = "160px"
    show_bottom: bool = False
    list_label: str = "Records"
    detail_label: str = "Detail"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-split-pane">{content}</div>'
