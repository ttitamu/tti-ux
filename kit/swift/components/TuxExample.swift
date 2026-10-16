// TuxExample.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxExample<Content: View>: View {
    public var vue: String
    public var react: String
    public var wc: String
    public var razor: String
    public var python: String
    public var php: String
    public var swift: String
    public var kotlin: String
    public var source: String
    public var css: String
    public var powerbi: String
    public var title: String
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
