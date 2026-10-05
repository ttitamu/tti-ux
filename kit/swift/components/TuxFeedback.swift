// TuxFeedback.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFeedback<Content: View>: View {
    public var pageId: String
    public var title: String = "Was"
    public var endpoint: String = "/api/feedback"
    public var allowDetails: Bool = true
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
