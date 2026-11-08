// TuxPeriodPicker.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPeriodPicker<Content: View>: View {
    public var modelValue: String? = nil
    public var presets: String? = nil
    public var label: String? = nil
    public var allowCompare: Bool = true
    public var stepDays: Int? = nil
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
