// TuxSegmentedInput.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSegmentedInput<Content: View>: View {
    public var modelValue: String? = nil
    public var segments: String? = nil
    public var separator: String = "-"
    public var label: String? = nil
    public var helpText: String? = nil
    public var uppercase: Bool = true
    public var disabled: Bool = false
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
