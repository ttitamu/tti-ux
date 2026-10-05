// TuxModal.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxModal<Content: View>: View {
    public var open: Bool = false
    public var title: String = "undefined"
    public var eyebrow: String = "undefined"
    public var size: String = undefined
    public var variant: String = standard
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
