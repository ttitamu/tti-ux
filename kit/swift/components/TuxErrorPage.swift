// TuxErrorPage.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxErrorPage<Content: View>: View {
    public var code: String = "404"
    public var title: String = "undefined"
    public var lede: String = "undefined"
    public var actions: String = "undefined"
    public var inline: Bool = false
    public var icon: String = "undefined"
    public var details: String = "undefined"
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
