"""
TuxRuleBuilderGroup — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRuleBuilderGroup:
    model_value: Optional[str] = None
    depth: Optional[int] = None
    is_root: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-rule-builder-group">{content}</div>'
