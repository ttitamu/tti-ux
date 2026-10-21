// TuxModal.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxModal<Content: View>: View {
    public var `open`: Bool = false
    public var title: String? = nil
    public var eyebrow: String? = nil
    public var size: String? = nil
    public var variant: String = "standard"
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
