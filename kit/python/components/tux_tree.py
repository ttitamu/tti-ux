"""
TuxTree — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTree:
    items: str = None
    default_expanded: str = "undefined"
    storage_key: str = "undefined"
    show_guides: bool = true
    aria_label: str = "Tree"

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-tree">{content}</ul>'
