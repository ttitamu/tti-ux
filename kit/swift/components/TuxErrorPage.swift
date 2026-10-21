// TuxErrorPage.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxErrorPage<Content: View>: View {
    public var code: String = "404"
    public var title: String? = nil
    public var lede: String? = nil
    public var actions: String? = nil
    public var inline: Bool = false
    public var icon: String? = nil
    public var details: String? = nil
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
