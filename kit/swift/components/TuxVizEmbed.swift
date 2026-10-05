// TuxVizEmbed.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxVizEmbed<Content: View>: View {
    public var src: String
    public var provider: String = "generic"
    public var title: String
    public var eyebrow: String = "undefined"
    public var ratio: String = "16/9"
    public var sandbox: String = "undefined"
    public var referrerpolicy: String = "strict-origin-when-cross-origin"
    public var openInNew: Bool = true
    public var posterSrc: String = "undefined"
    public var posterAlt: String
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
