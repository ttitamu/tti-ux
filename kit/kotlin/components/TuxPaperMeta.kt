// TuxPaperMeta.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxPaperMeta(
    doi: String = "undefined",
    license: String = "undefined",
    funders: String = "undefined",
    published: String = "undefined",
    version: String = "undefined",
    type: String = "undefined",
    pages: String = "undefined",
    venue: String = "undefined",
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
