// TuxPortalHeader.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxPortalHeader(
    mode: String = "comm",
    agencyName: String = "Texas A&M Transportation Institute",
    agencyUrl: String = "https://tti.tamu.edu",
    homeUrl: String = "/",
    portalTitle: String = "",
    portalBadge: String = "",
    portalBadgeVariant: String = "gold",
    utilityLinks: String? = null,
    showSearch: Boolean = true,
    showSpectrumRibbon: Boolean = false,
    showSpectrum: Boolean = false,
    intranetApps: String? = null,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
