// TuxTooltip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTooltip<Content: View>: View {
    public var text: String
    public var title: String = "undefined"
    public var kbds: String = "undefined"
    public var side: String = top
    public var arrow: Bool = true
    public var disabled: Bool = false
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
