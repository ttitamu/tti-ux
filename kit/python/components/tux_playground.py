"""
TuxPlayground — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPlayground:
    tag: str = None
    component_name: str = None
    controls: str = None
    presets: str = None
    title: str = None
    eyebrow: str = None
    slot_prop: str = None
    default_slot_text: str = None
    self_closing: bool = false
    code_template: str = None
    source: str = None
    powerbi: str = None
    preview_padding: str = "p-8"
    enable_deep_linking: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-playground">{content}</div>'
