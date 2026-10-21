// TuxTableCaption.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTableCaption<Content: View>: View {
    public var label: String = "Table"
    public var number: String? = nil
    public var caption: String? = nil
    public var source: String? = nil
    public var placement: String = "above"
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
