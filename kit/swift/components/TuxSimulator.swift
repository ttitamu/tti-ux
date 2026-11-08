// TuxSimulator.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSimulator<Content: View>: View {
    public var title: String = "Workload & Cost Simulator"
    public var subtitle: String? = nil
    public var parameters: String? = nil
    public var presets: String? = nil
    public var primaryLabel: String = "Proposed Pool"
    public var comparisonLabel: String = "Baseline Pool"
    public var budgetLimit: Int = 0
    public var currencySymbol: String = "$"
    public var showComparison: Bool = true
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
