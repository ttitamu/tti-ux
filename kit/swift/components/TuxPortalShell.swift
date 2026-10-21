// TuxPortalShell.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPortalShell<Content: View>: View {
    public var portalTitle: String = ""
    public var portalBadge: String = ""
    public var portalBadgeVariant: String = "gold"
    public var navItems: String? = nil
    public var actionText: String = ""
    public var actionTo: String = ""
    public var actionHref: String = ""
    public var utilityLinks: String? = nil
    public var agencyName: String = "Texas A&M Transportation Institute"
    public var agencyUrl: String = "https://tti.tamu.edu"
    public var homeUrl: String = "/"
    public var showSearch: Bool = true
    public var stickyHeader: Bool = true
    public var breadcrumbs: String? = nil
    public var maxWidth: String = "standard"
    public var showFeedback: Bool = true
    public var feedbackLabel: String = "Feedback"
    public var showFooter: Bool = true
    public var headerProps: String? = nil
    public var footerProps: String? = nil
    public var mainClass: String = "py-8"
    public var `as`: String = "main"
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
