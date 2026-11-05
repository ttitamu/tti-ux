"""
TuxSimulator — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSimulator:
    title: str = "Workload & Cost Simulator"
    subtitle: Optional[str] = None
    parameters: Optional[str] = None
    presets: Optional[str] = None
    primary_label: str = "Proposed Pool"
    comparison_label: str = "Baseline Pool"
    budget_limit: int = 0
    currency_symbol: str = "$"
    show_comparison: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-simulator">{content}</section>'
