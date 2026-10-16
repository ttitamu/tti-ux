// TuxPlayground.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPlayground<Content: View>: View {
    public var tag: String
    public var componentName: String
    public var controls: String
    public var presets: String
    public var title: String
    public var eyebrow: String
    public var slotProp: String
    public var defaultSlotText: String
    public var selfClosing: Bool = false
    public var codeTemplate: String
    public var source: String
    public var powerbi: String
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
