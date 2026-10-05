// TuxSplashScreen.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSplashScreen<Content: View>: View {
    public var loaded: Bool = false
    public var status: String = "Loading…"
    public var hidden: Bool = false
    public var fadeDelay: Int = 300
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
