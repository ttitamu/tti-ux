// TuxMapEmbed.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxMapEmbed(
    src: String? = null,
    eyebrow: String? = null,
    title: String? = null,
    subtitle: String? = null,
    source: String? = null,
    aspect: String = "16/9",
    height: Int? = null,
    iframeTitle: String? = null,
    attribution: Boolean = true,
    skeleton: Boolean = true,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
