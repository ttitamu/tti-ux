// TuxMarkdownEditor.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMarkdownEditor<Content: View>: View {
    public var modelValue: String
    public var rows: Int = 12
    public var minLength: Int = undefined
    public var maxLength: Int = undefined
    public var placeholder: String = "Write"
    public var preview: Bool = true
    public var disabled: Bool = false
    public var ariaLabel: String = "Markdown"
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
