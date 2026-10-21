// TuxSectionHeader.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSectionHeader<Content: View>: View {
    public var level: Int = 2
    public var title: String
    public var secondaryTitle: String
    public var subtitle: String
    public var kicker: String
    public var variant: String = "institutional"
    public var division: String
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
