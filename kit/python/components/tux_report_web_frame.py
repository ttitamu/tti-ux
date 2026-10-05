"""
TuxReportWebFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxReportWebFrame:
    eyebrow: str = "undefined"
    title: str = "undefined"
    lede: str = "undefined"
    byline: str = "undefined"
    date: str = "undefined"
    reading_time: str = "undefined"
    toc: str = "()"
    width: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-report-web-frame">{content}</article>'
