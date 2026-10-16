// TuxCardSlab.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCardSlab<Content: View>: View {
    public var cards: String
    public var columns: Int = 3
    public var aspect: String = "4/5"
    public var heading: String
    public var eyebrow: String
    public var inset: Bool = false
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
