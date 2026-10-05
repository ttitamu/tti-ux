"""
TuxTreeNode — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTreeNode:
    node: str = None
    depth: int = None
    selected_id: str = None
    is_expanded: str = None
    show_guides: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<li class="tux-tree-node">{content}</li>'
