// TuxCommHero.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxCommHero(
    eyebrow: String = "TEXAS",
    title: String,
    accentTitle: String,
    lead: String,
    primaryActionText: String,
    primaryActionTo: String,
    primaryActionHref: String,
    secondaryActionText: String,
    secondaryActionTo: String,
    secondaryActionHref: String,
    imageSrc: String,
    imageAlt: String = "TTI",
    imageBadge: String,
    chamfer: Boolean = true,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
