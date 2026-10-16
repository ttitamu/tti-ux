"""
TuxPlayground — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPlayground:
    tag: Optional[str] = None
    component_name: Optional[str] = None
    controls: Optional[str] = None
    presets: Optional[str] = None
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    slot_prop: Optional[str] = None
    default_slot_text: Optional[str] = None
    self_closing: bool = False
    code_template: Optional[str] = None
    source: Optional[str] = None
    powerbi: Optional[str] = None
    preview_padding: str = "p-8"
    enable_deep_linking: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-playground">{content}</div>'
