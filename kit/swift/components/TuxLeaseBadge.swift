// TuxLeaseBadge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLeaseBadge<Content: View>: View {
    public var label: String? = nil
    public var remainingHours: Int? = nil
    public var expiresLabel: String? = nil
    public var warningHours: Int = 72
    public var extendable: Bool = false
    public var releasable: Bool = false
    public var extendLabel: String = "Extend"
    public var releaseLabel: String = "Release"
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
