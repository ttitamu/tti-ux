// TuxPageHeader.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPageHeader<Content: View>: View {
    public var eyebrow: String? = nil
    public var title: String? = nil
    public var level: Int = 1
    public var tone: String = "plain"
    public var rhythm: String = "compact"
    public var variant: String = "default"
    public var division: String? = nil
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
