"""
TuxStageBoard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStageBoard:
    stages: Optional[str] = None
    items: Optional[str] = None
    metric_prefix: str = ""
    metric_suffix: str = ""
    decimals: int = 0
    movable: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-stage-board">{content}</div>'
