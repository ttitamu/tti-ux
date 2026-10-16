// TuxStalenessBanner.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxStalenessBanner<Content: View>: View {
    public var stale: Bool = false
    public var verifiedUntil: String
    public var lastVerified: String
    public var reviewCadenceDays: Int = 90
    public var owner: String
    public var pageId: String
    public var dismissable: Bool = true
    public var showVerifiedBadge: Bool = false
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
