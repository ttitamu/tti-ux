// TuxTOC.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTOC<Content: View>: View {
    public var items: String? = nil
    public var target: String = "article"
    public var levels: String? = nil
    public var title: String = "On this page"
    public var noTitle: Bool = false
    public var variant: String = "comm"
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
