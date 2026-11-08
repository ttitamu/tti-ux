"""
TuxAnomalyCard — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAnomalyCard:
    id: str = "anomaly-card"
    title: Optional[str] = None
    metric_label: Optional[str] = None
    current_value: Optional[str] = None
    baseline_label: Optional[str] = None
    delta_label: Optional[str] = None
    projection_label: Optional[str] = None
    severity: str = "critical"
    state: str = "open"
    rule_summary: Optional[str] = None
    series: Optional[str] = None
    target_entity: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-anomaly-card">{content}</article>'
