"""
TuxLogViewer — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLogViewer:
    title: str = "Operational Job & Telemetry Logs"
    lines: Optional[str] = None
    initial_level: str = "all"
    wrap_lines: bool = True
    show_line_numbers: bool = True
    max_height: str = "24rem"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-log-viewer">{content}</div>'
