// TuxPopover.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPopover<Content: View>: View {
    public var title: String = "undefined"
    public var body: String = "undefined"
    public var mode: String = click
    public var side: String = bottom
    public var arrow: Bool = true
    public var disabled: Bool = false
    public var width: String = md
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
