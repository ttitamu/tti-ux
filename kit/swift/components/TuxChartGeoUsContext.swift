// TuxChartGeoUsContext.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGeoUsContext<Content: View>: View {
    public var states: String? = nil
    public var highlight: String? = nil
    public var legendLabel: String? = nil
    public var legendStops: String? = nil
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
