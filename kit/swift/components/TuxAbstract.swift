// TuxAbstract.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAbstract<Content: View>: View {
    public var background: String = "undefined"
    public var methods: String = "undefined"
    public var results: String = "undefined"
    public var conclusion: String = "undefined"
    public var keywords: String = "undefined"
    public var variant: String = structured
    public var level: String = 4
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
