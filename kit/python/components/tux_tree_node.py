"""
TuxTreeNode — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTreeNode:
    node: Optional[str] = None
    depth: Optional[int] = None
    selected_id: Optional[str] = None
    is_expanded: Optional[str] = None
    show_guides: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<li class="tux-tree-node">{content}</li>'
