// TuxMcpEmbed.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMcpEmbed<Content: View>: View {
    public var appName: String
    public var appIcon: String = "lucide:plug"
    public var appIconUrl: String = "undefined"
    public var source: String = "undefined"
    public var loading: Bool = false
    public var collapsible: Bool = true
    public var expandable: Bool = true
    public var closable: Bool = true
    public var collapsed: Bool = false
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
