// TuxSectionHeader.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSectionHeader<Content: View>: View {
    public var level: Int = 2
    public var title: String? = nil
    public var secondaryTitle: String? = nil
    public var subtitle: String? = nil
    public var kicker: String? = nil
    public var variant: String = "institutional"
    public var division: String? = nil
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
