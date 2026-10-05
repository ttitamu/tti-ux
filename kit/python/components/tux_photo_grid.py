"""
TuxPhotoGrid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPhotoGrid:
    items: str = None
    kind: str = photo
    columns: str = 3
    aspect: str = undefined

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-photo-grid">{content}</ul>'
