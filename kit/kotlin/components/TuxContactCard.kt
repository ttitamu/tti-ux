// TuxContactCard.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxContactCard(
    name: String? = null,
    role: String? = null,
    affiliation: String? = null,
    credentials: String? = null,
    image: String? = null,
    initial: String? = null,
    tone: String = "maroon",
    contacts: String? = null,
    layout: String = "vertical",
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
