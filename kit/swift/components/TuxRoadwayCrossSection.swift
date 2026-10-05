// TuxRoadwayCrossSection.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRoadwayCrossSection<Content: View>: View {
    public var preset: String = urban-managed
    public var initialView: String = 3d-perspective
    public var height: String = "560px"
    public var interactive: Bool = true
    public var initialPitch: Int = 0
    public var initialYaw: Int = 0
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
