"""
TuxPhotoGrid — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPhotoGrid:
    items: Optional[str] = None
    kind: str = "photo"
    columns: int = 3
    aspect: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<ul class="tux-photo-grid">{content}</ul>'
