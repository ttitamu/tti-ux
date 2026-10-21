// TuxFooter.kt — Jetpack Compose Android Composable.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

package edu.tamu.tti.tux.components

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TuxFooter(
    name: String = "Texas A&M Transportation Institute",
    address: String = "Texas A&M Transportation Institute\nCollege Station, TX 77843",
    phone: String = "(979) 317-2000",
    logo: String = "/logo.svg",
    logoSize: Int = 80,
    brandLockup: String = "/TTI_white.png",
    brandLockupAlt: String = "Texas A&M Transportation Institute",
    social: String? = null,
    columns: String? = null,
    tagline: String = "Coordinated Statewide Transportation Research Program",
    year: Int? = null,
    content: @Composable () -> Unit = {}
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        content()
    }
}
