// TuxPlayground.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPlayground<Content: View>: View {
    public var tag: String = "undefined"
    public var componentName: String = "undefined"
    public var controls: String
    public var presets: String = "()"
    public var title: String = "Interactive"
    public var eyebrow: String = "Live"
    public var slotProp: String = "undefined"
    public var defaultSlotText: String = "undefined"
    public var selfClosing: Bool = false
    public var codeTemplate: String = "undefined"
    public var previewPadding: String = "p-8"
    public var enableDeepLinking: Bool = true
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
