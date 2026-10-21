// TuxPlayground.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPlayground<Content: View>: View {
    public var tag: String? = nil
    public var componentName: String? = nil
    public var controls: String? = nil
    public var presets: String? = nil
    public var title: String = "Interactive Props Workbench"
    public var eyebrow: String = "Live Component Playground"
    public var slotProp: String? = nil
    public var defaultSlotText: String? = nil
    public var selfClosing: Bool = false
    public var codeTemplate: String? = nil
    public var source: String? = nil
    public var powerbi: String? = nil
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
