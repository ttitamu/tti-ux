// TuxProportionalInput.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxProportionalInput<Content: View>: View {
    public var modelValue: String? = nil
    public var targetTotal: Int = 100
    public var unit: String = "%"
    public var decimals: Int = 1
    public var step: Int = 1
    public var title: String? = nil
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
