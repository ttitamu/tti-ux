// TuxFAB.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFAB<Content: View>: View {
    public var icon: String
    public var extended: Bool = false
    public var size: String = md
    public var side: String = right
    public var ariaLabel: String = "undefined"
    public var disabled: Bool = false
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
