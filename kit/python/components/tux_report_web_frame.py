"""
TuxReportWebFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReportWebFrame:
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    lede: Optional[str] = None
    byline: Optional[str] = None
    date: Optional[str] = None
    reading_time: Optional[str] = None
    toc: str = "()"
    width: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-report-web-frame">{content}</article>'
