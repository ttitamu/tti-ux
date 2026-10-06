// TuxPortalShell.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPortalShell<Content: View>: View {
    public var portalTitle: String
    public var portalBadge: String
    public var portalBadgeVariant: String = gold
    public var navItems: String = "()"
    public var actionText: String
    public var actionTo: String
    public var actionHref: String
    public var utilityLinks: String
    public var agencyName: String = "Texas"
    public var agencyUrl: String = "https://tti.tamu.edu"
    public var homeUrl: String = "/"
    public var showSearch: Bool = true
    public var stickyHeader: Bool = true
    public var breadcrumbs: String = "()"
    public var maxWidth: String = standard
    public var showFeedback: Bool = true
    public var feedbackLabel: String = "Feedback"
    public var showFooter: Bool = true
    public var headerProps: String = "()"
    public var footerProps: String
    public var mainClass: String
    public var as: String
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
