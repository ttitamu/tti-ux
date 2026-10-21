// TuxFileDropzone.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFileDropzone<Content: View>: View {
    public var modelValue: String? = nil
    public var accept: String? = nil
    public var multiple: Bool = false
    public var maxSize: Int? = nil
    public var maxFiles: Int = 10
    public var disabled: Bool = false
    public var label: String? = nil
    public var hint: String? = nil
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
