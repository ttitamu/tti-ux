// TuxAvatar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAvatar<Content: View>: View {
    public var name: String = "undefined"
    public var initials: String = "undefined"
    public var photoUrl: String = "undefined"
    public var size: String = md
    public var dot: String = undefined
    public var decorative: Bool = true
    public var alt: String = "undefined"
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
