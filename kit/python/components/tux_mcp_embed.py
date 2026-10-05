"""
TuxMcpEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMcpEmbed:
    app_name: str = None
    app_icon: str = "lucide:plug"
    app_icon_url: str = "undefined"
    source: str = "undefined"
    loading: bool = false
    collapsible: bool = true
    expandable: bool = true
    closable: bool = true
    collapsed: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-mcp-embed">{content}</section>'
