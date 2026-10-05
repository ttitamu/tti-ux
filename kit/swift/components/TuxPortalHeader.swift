// TuxPortalHeader.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPortalHeader<Content: View>: View {
    public var mode: String = comm
    public var agencyName: String = "Texas"
    public var agencyUrl: String = "https://tti.tamu.edu"
    public var homeUrl: String = "/"
    public var portalTitle: String
    public var portalBadge: String
    public var portalBadgeVariant: String = gold
    public var utilityLinks: String = "()"
    public var showSearch: Bool = true
    public var showSpectrumRibbon: Bool = false
    public var intranetApps: String = "()"
    private let content: Content

    public init(
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
    }

    public var body: some View {
        HStack {
            content
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
    }
}
