// TuxECharts.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxECharts<Content: View>: View {
    public var options: String? = nil
    public var height: String = "380px"
    public var width: String = "100%"
    public var ariaTitle: String = "Interactive data visualization"
    public var ariaSummary: String = ""
    public var extensions: String? = nil
    public var maps: String? = nil
    public var loading: Bool = false
    public var notMerge: Bool = false
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
