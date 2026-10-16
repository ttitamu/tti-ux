// TuxSlideover.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSlideover<Content: View>: View {
    public var side: String = "right"
    public var size: String
    public var title: String
    public var eyebrow: String
    public var showClose: Bool = true
    public var closeOnBackdrop: Bool = true
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
