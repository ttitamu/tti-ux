// TuxCorridorStrip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCorridorStrip<Content: View>: View {
    public var name: String = "undefined"
    public var fromMile: Int
    public var toMile: Int
    public var segments: String = "undefined"
    public var events: String = "undefined"
    public var values: String = "undefined"
    public var valuesLabel: String = "undefined"
    public var direction: String = "undefined"
    public var width: Int = 800
    public var height: Int = 140
    public var tickEvery: Int = 5
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
