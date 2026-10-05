"""
TuxArtifact — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxArtifact:
    title: str = None
    meta: str = "undefined"
    icon: str = "lucide:file-code"
    actions: str = "()"
    busy: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-artifact">{content}</section>'
