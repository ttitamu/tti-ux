// TuxEntityPicker.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEntityPicker<Content: View>: View {
    public var modelValue: String? = nil
    public var options: String? = nil
    public var label: String? = nil
    public var placeholder: String = "Search by code, title, or owner…"
    public var clearable: Bool = true
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
