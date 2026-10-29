// TuxColumnMapper.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxColumnMapper<Content: View>: View {
    public var sourceColumns: String? = nil
    public var sampleRows: String? = nil
    public var targetFields: String? = nil
    public var modelValue: String? = nil
    public var confirmLabel: String = "Apply Mapping"
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
