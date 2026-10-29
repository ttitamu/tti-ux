"""
TuxRecordDiff — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRecordDiff:
    fields: Optional[str] = None
    before_label: str = "Baseline"
    after_label: str = "Current"
    changes_only_default: bool = False
    title: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-record-diff">{content}</div>'
