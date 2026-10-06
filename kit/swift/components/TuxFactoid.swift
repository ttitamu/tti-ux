// TuxFactoid.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFactoid<Content: View>: View {
    public var items: String
    public var variant: String = default
    public var columns: String = 3
    public var eyebrow: String = "undefined"
    public var title: String = "undefined"
    public var dek: String = "undefined"
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
