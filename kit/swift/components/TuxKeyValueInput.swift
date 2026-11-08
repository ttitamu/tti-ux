// TuxKeyValueInput.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxKeyValueInput<Content: View>: View {
    public var modelValue: String? = nil
    public var schema: String? = nil
    public var strictKeys: Bool = false
    public var keyPlaceholder: String = "key"
    public var valuePlaceholder: String = "value"
    public var addLabel: String = "Add attribute"
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
