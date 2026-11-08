// TuxPivotMatrix.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPivotMatrix<Content: View>: View {
    public var caption: String? = nil
    public var rowLabels: String? = nil
    public var colLabels: String? = nil
    public var values: String? = nil
    public var rowHeaderLabel: String = "Category"
    public var valuePrefix: String = ""
    public var valueSuffix: String = ""
    public var decimals: Int = 0
    public var shaded: Bool = true
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
