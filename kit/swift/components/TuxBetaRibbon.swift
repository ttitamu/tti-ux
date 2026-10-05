// TuxBetaRibbon.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBetaRibbon<Content: View>: View {
    public var variant: String = "corner"
    public var kind: String = "preview"
    public var label: String = "undefined"
    public var corner: String = "top-right"
    public var message: String = "undefined"
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
