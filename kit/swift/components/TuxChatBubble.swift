// TuxChatBubble.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChatBubble<Content: View>: View {
    public var mode: String = "bubble"
    public var role: String = "assistant"
    public var title: String = "Assistant"
    public var subtitle: String = "Institutional Assistant"
    public var state: String = "idle"
    public var teaser: String? = nil
    public var tail: String = "none"
    public var dismissible: Bool = false
    public var `open`: Bool = true
    public var suggestions: String? = nil
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
