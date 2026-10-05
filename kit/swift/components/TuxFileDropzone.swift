// TuxFileDropzone.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFileDropzone<Content: View>: View {
    public var modelValue: String = "()"
    public var accept: String = "undefined"
    public var multiple: Bool = false
    public var maxSize: Int = 50
    public var maxFiles: Int = 10
    public var disabled: Bool = false
    public var label: String = "undefined"
    public var hint: String = "undefined"
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
