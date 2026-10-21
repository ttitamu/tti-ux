// TuxExample.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxExample<Content: View>: View {
    public var vue: String? = nil
    public var react: String? = nil
    public var wc: String? = nil
    public var razor: String? = nil
    public var python: String? = nil
    public var php: String? = nil
    public var swift: String? = nil
    public var kotlin: String? = nil
    public var source: String? = nil
    public var css: String? = nil
    public var powerbi: String? = nil
    public var title: String? = nil
    public var previewPadding: String = "p-6"
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
