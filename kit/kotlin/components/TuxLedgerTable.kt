// TuxLedgerTable.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxLedgerTable(
    caption: String? = null,
    groups: String? = null,
    valuePrefix: String = "",
    valueSuffix: String = "",
    decimals: Int = 2,
    showQuantityRate: Boolean = true,
    exportable: Boolean = true,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
