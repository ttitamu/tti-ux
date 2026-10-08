"""
TuxSkeleton — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSkeleton:
    kind: str = "primitive"
    variant: str = "block"
    width: str = "100%"
    height: Optional[str] = None
    radius: Optional[str] = None
    count: int = 3
    animated: str = "shimmer"
    label: str = "Loading…"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-skeleton">{content}</div>'
