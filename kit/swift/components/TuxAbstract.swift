// TuxAbstract.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAbstract<Content: View>: View {
    public var background: String
    public var methods: String
    public var results: String
    public var conclusion: String
    public var keywords: String
    public var variant: String = "structured"
    public var level: Int = 4
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
