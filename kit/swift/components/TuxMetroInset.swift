// TuxMetroInset.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMetroInset<Content: View>: View {
    public var name: String
    public var highwayLabel: String
    public var height: Int = 220
    public var palette: String = "maroon"
    public var seed: String
    public var cols: Int = 8
    public var rows: Int = 6
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
