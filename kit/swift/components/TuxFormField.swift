// TuxFormField.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFormField<Content: View>: View {
    public var label: String
    public var help: String = "undefined"
    public var hint: String = "undefined"
    public var error: String = "undefined"
    public var required: Bool = false
    public var inputId: String = "undefined"
    public var layout: String = stacked
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
