"""
TuxResourceMeter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxResourceMeter:
    title: Optional[str] = None
    subtitle: Optional[str] = None
    pool_status: str = "ok"
    channels: Optional[str] = None
    waste_threshold_ratio: float = 0.35
    saturation_threshold_ratio: float = 0.85
    reclaim_label: str = "Reclaim Idle"
    show_reclaim_action: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-resource-meter">{content}</div>'
