// TuxCapabilityCluster.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCapabilityCluster<Content: View>: View {
    public var title: String = "RESEARCH CAPABILITIES"
    public var kicker: String = "Research Programs"
    public var subtitle: String = "Applied research and testing capabilities across nine core transportation disciplines."
    public var capabilities: String? = nil
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
