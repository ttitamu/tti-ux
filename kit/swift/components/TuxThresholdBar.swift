// TuxThresholdBar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxThresholdBar<Content: View>: View {
    public var title: String? = nil
    public var segments: String? = nil
    public var limit: Int? = nil
    public var unit: String = ""
    public var unitPosition: String = "suffix"
    public var decimals: Int = 1
    public var warningRatio: Double = 0.85
    public var showLegend: Bool = true
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
