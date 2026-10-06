// TuxSpectrumRibbon.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSpectrumRibbon<Content: View>: View {
    public var size: String = sm
    public var orientation: String = horizontal
    public var showLabels: Bool = false
    public var rounded: Bool = false
    public var ariaLabel: String = "TTI"
    public var bands: String = "()"
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
