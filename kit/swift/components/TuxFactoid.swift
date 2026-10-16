// TuxFactoid.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFactoid<Content: View>: View {
    public var items: String
    public var variant: String = "default"
    public var columns: Int = 3
    public var eyebrow: String
    public var title: String
    public var dek: String
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
