// TuxErrorPage.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxErrorPage<Content: View>: View {
    public var code: String = "404"
    public var title: String
    public var lede: String
    public var actions: String
    public var inline: Bool = false
    public var icon: String
    public var details: String
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
