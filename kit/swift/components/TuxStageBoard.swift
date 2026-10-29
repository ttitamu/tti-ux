// TuxStageBoard.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxStageBoard<Content: View>: View {
    public var stages: String? = nil
    public var items: String? = nil
    public var metricPrefix: String = ""
    public var metricSuffix: String = ""
    public var decimals: Int = 0
    public var movable: Bool = true
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
