// TuxResearcher.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxResearcher(
    name: String,
    role: String,
    portrait: String = "undefined",
    center: String = "undefined",
    orcid: String = "undefined",
    email: String = "undefined",
    bio: String = "undefined",
    projects: String = "undefined",
    metrics: String = "undefined",
    layout: String = default,
    to: String = "undefined",
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
