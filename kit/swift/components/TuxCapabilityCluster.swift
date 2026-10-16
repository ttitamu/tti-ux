// TuxCapabilityCluster.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCapabilityCluster<Content: View>: View {
    public var title: String
    public var kicker: String
    public var subtitle: String
    public var capabilities: String
    public var columns: Int = 3
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
