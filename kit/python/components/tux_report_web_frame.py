"""
TuxReportWebFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReportWebFrame:
    eyebrow: str = None
    title: str = None
    lede: str = None
    byline: str = None
    date: str = None
    reading_time: str = None
    toc: str = None
    width: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-report-web-frame">{content}</article>'
