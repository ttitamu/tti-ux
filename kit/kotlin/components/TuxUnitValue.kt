// TuxUnitValue.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxUnitValue(
    value: Int? = null,
    unit: String? = null,
    ci: Int? = null,
    decimals: Int? = null,
    label: String = "",
    station: String = "",
    variant: String = "inline",
    interactive: Boolean = false,
    system: String? = null,
    division: String? = null,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
