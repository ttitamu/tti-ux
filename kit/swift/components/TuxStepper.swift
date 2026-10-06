// TuxStepper.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxStepper<Content: View>: View {
    public var steps: String
    public var currentIndex: Int = 0
    public var orientation: String = horizontal
    public var showDescriptions: Bool = true
    public var ariaLabel: String = "Progress"
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
