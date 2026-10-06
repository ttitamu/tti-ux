// TuxBigStat.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBigStat<Content: View>: View {
    public var value: String
    public var suffix: String = null
    public var label: String
    public var source: String = null
    public var variant: String = default
    public var tone: String = maroon
    public var size: String = md
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
