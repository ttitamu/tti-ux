"""
TuxMcpEmbed — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMcpEmbed:
    app_name: Optional[str] = None
    app_icon: str = "lucide:plug"
    app_icon_url: Optional[str] = None
    source: Optional[str] = None
    loading: bool = False
    collapsible: bool = True
    expandable: bool = True
    closable: bool = True
    collapsed: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-mcp-embed">{content}</section>'
