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
    name: String? = null,
    role: String? = null,
    portrait: String? = null,
    center: String? = null,
    orcid: String? = null,
    email: String? = null,
    bio: String? = null,
    projects: String? = null,
    metrics: String? = null,
    layout: String = "default",
    to: String? = null,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
