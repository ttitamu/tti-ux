// TuxComposer.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxComposer<Content: View>: View {
    public var modelValue: String = ""
    public var placeholder: String = "Ask about any ingested corpus…"
    public var models: String? = nil
    public var modelId: String? = nil
    public var maxLength: Int = 32000
    public var hint: String = "⌘↵ send · / corpus to switch context · shift↵ newline"
    public var hideAttach: Bool = false
    public var attachLabel: String = "Attach corpus"
    public var attachIcon: String = "lucide:plus"
    public var cancelable: Bool = false
    public var cancelLabel: String = "Cancel"
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
