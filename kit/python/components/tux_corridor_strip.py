"""
TuxCorridorStrip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCorridorStrip:
    name: Optional[str] = None
    from_mile: Optional[int] = None
    to_mile: Optional[int] = None
    segments: Optional[str] = None
    events: Optional[str] = None
    values: Optional[str] = None
    values_label: Optional[str] = None
    direction: Optional[str] = None
    width: int = 800
    height: int = 140
    tick_every: int = 5
    tick_format: str = "mile"
    sync_channel: Optional[str] = None
    active_mile: Optional[int] = None
    interactive_scrub: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-corridor-strip">{content}</figure>'
