// TuxSpectrumFacts.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSpectrumFacts<Content: View>: View {
    public var title: String = "QUICK"
    public var subtitle: String
    public var items: String = "()"
    public var tone: String = dark
    public var showTopRibbon: Bool = true
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
