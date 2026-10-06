// TuxSplitPane.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSplitPane<Content: View>: View {
    public var modelValue: String = null
    public var initialListWidth: String = "320px"
    public var minListWidth: Int = 220
    public var maxListWidth: Int = 560
    public var id: String = "undefined"
    public var initialBottomHeight: String = "160px"
    public var showBottom: Bool = false
    public var listLabel: String = "Records"
    public var detailLabel: String = "Detail"
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
