// TuxRichTextEditor.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRichTextEditor<Content: View>: View {
    public var modelValue: String
    public var placeholder: String = "Start"
    public var disabled: Bool = false
    public var minHeight: String = "12rem"
    public var maxHeight: String = "auto"
    public var toolbar: String = ()
    public var headingLevels: String = ()
    public var showCount: Bool = true
    public var fullscreenable: Bool = true
    public var ariaLabel: String = "Rich"
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
