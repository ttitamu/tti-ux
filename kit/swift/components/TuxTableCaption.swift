// TuxTableCaption.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTableCaption<Content: View>: View {
    public var label: String = "Table"
    public var number: String
    public var caption: String = "undefined"
    public var source: String = "undefined"
    public var placement: String = above
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
