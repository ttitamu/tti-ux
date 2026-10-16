"""
TuxCorridorStrip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCorridorStrip:
    name: str = None
    from_mile: int = None
    to_mile: int = None
    segments: str = None
    events: str = None
    values: str = None
    values_label: str = None
    direction: str = None
    width: int = 800
    height: int = 140
    tick_every: int = 5

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-corridor-strip">{content}</figure>'
