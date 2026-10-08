"""
TuxTree — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTree:
    items: Optional[str] = None
    default_expanded: Optional[str] = None
    storage_key: Optional[str] = None
    show_guides: bool = True
    aria_label: str = "Tree"

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-tree">{content}</ul>'
