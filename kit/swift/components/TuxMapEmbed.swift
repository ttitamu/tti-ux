// TuxMapEmbed.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMapEmbed<Content: View>: View {
    public var src: String = "undefined"
    public var eyebrow: String = "undefined"
    public var title: String = "undefined"
    public var subtitle: String = "undefined"
    public var source: String = "undefined"
    public var aspect: String = 16/9
    public var height: Int = undefined
    public var iframeTitle: String = "undefined"
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
