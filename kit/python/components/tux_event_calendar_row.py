"""
TuxEventCalendarRow — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEventCalendarRow:
    day: Optional[str] = None
    month: Optional[str] = None
    title: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    to: Optional[str] = None
    href: Optional[str] = None
    action_text: Optional[str] = None
    chip_tone: str = "green"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-event-calendar-row">{content}</article>'
