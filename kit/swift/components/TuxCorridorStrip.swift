// TuxCorridorStrip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCorridorStrip<Content: View>: View {
    public var name: String? = nil
    public var fromMile: Int? = nil
    public var toMile: Int? = nil
    public var segments: String? = nil
    public var events: String? = nil
    public var values: String? = nil
    public var valuesLabel: String? = nil
    public var direction: String? = nil
    public var width: Int = 800
    public var height: Int = 140
    public var tickEvery: Int = 5
    public var tickFormat: String = "mile"
    public var syncChannel: String? = nil
    public var activeMile: Int? = nil
    public var interactiveScrub: Bool = false
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
