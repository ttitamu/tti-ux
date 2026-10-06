"""
TuxReportPrintSheet — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReportPrintSheet:
    size: str = letter
    margin: str = "0.6in"

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-report-print-sheet">{content}</span>'
