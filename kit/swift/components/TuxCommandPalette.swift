// TuxCommandPalette.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCommandPalette<Content: View>: View {
    public var groups: String
    public var placeholder: String = "Type"
    public var disableHotkey: Bool = false
    public var hotkey: String = "k"
    public var showTabs: Bool = true
    public var defaultTab: String = "all"
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
