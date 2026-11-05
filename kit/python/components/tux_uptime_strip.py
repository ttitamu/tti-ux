"""
TuxUptimeStrip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxUptimeStrip:
    service_name: Optional[str] = None
    service_group: Optional[str] = None
    buckets: Optional[str] = None
    window_label: str = "Last 30 days"
    sla_target_pct: float = 99.9
    current_latency_ms: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-uptime-strip">{content}</div>'
