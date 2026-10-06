// TuxMcpEmbed.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxMcpEmbed(
    appName: String,
    appIcon: String = "lucide:plug",
    appIconUrl: String = "undefined",
    source: String = "undefined",
    loading: Boolean = false,
    collapsible: Boolean = true,
    expandable: Boolean = true,
    closable: Boolean = true,
    collapsed: Boolean = false,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
