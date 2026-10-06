"""
TuxEventCalendarRow — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEventCalendarRow:
    day: str = None
    month: str = None
    title: str = None
    time: str = None
    location: str = None
    category: str = None
    to: str = None
    href: str = None
    action_text: str = "View"
    chip_tone: str = green

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-event-calendar-row">{content}</article>'
