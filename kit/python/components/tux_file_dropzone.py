"""
TuxFileDropzone — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFileDropzone:
    model_value: Optional[str] = None
    accept: Optional[str] = None
    multiple: bool = False
    max_size: Optional[int] = None
    max_files: int = 10
    disabled: bool = False
    label: Optional[str] = None
    hint: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-file-dropzone">{content}</div>'
