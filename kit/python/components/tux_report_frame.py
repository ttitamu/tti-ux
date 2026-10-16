"""
TuxReportFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReportFrame:
    size: str = "letter"
    density: str = "editorial"
    break_after: bool = False
    title: Optional[str] = None
    eyebrow: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-report-frame">{content}</article>'
