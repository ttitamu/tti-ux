// TuxAnomalyCard.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxAnomalyCard(
    id: String = "anomaly-card",
    title: String? = null,
    metricLabel: String? = null,
    currentValue: String? = null,
    baselineLabel: String? = null,
    deltaLabel: String? = null,
    projectionLabel: String? = null,
    severity: String = "critical",
    state: String = "open",
    ruleSummary: String? = null,
    series: String? = null,
    targetEntity: String? = null,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
