"""
TuxRuleBuilder — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRuleBuilder:
    model_value: Optional[str] = None
    fields: Optional[str] = None
    show_actions: bool = True
    max_depth: int = 3

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rule-builder">{content}</div>'
