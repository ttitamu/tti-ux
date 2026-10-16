// TuxMapEmbed.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMapEmbed<Content: View>: View {
    public var src: String
    public var eyebrow: String
    public var title: String
    public var subtitle: String
    public var source: String
    public var aspect: String = "16/9"
    public var height: Int
    public var iframeTitle: String
    public var attribution: Bool = true
    public var skeleton: Bool = true
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
