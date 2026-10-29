"""
TuxLedgerTable — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLedgerTable:
    caption: Optional[str] = None
    groups: Optional[str] = None
    value_prefix: str = ""
    value_suffix: str = ""
    decimals: int = 2
    show_quantity_rate: bool = True
    exportable: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-ledger-table">{content}</div>'
