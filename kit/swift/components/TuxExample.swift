// TuxExample.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxExample<Content: View>: View {
    public var vue: String = "undefined"
    public var react: String = "undefined"
    public var wc: String = "undefined"
    public var razor: String = "undefined"
    public var source: String = "undefined"
    public var css: String = "undefined"
    public var powerbi: String = "undefined"
    public var title: String = "undefined"
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
