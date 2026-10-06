// TuxSectionHeader.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSectionHeader<Content: View>: View {
    public var level: String = 2
    public var title: String = "undefined"
    public var secondaryTitle: String = "undefined"
    public var subtitle: String = "undefined"
    public var kicker: String = "undefined"
    public var variant: String = institutional
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
