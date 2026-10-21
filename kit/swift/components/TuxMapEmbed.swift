// TuxMapEmbed.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMapEmbed<Content: View>: View {
    public var src: String? = nil
    public var eyebrow: String? = nil
    public var title: String? = nil
    public var subtitle: String? = nil
    public var source: String? = nil
    public var aspect: String = "16/9"
    public var height: Int? = nil
    public var iframeTitle: String? = nil
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
