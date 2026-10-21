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
    time: str = ""
    location: str = ""
    category: str = ""
    to: str = ""
    href: str = ""
    action_text: str = "View Event"
    chip_tone: str = "green"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-event-calendar-row">{content}</article>'
