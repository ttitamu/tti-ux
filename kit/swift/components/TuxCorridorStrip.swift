// TuxCorridorStrip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCorridorStrip<Content: View>: View {
    public var name: String
    public var fromMile: Int
    public var toMile: Int
    public var segments: String
    public var events: String
    public var values: String
    public var valuesLabel: String
    public var direction: String
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
