// TuxAvatar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAvatar<Content: View>: View {
    public var name: String? = nil
    public var initials: String? = nil
    public var photoUrl: String? = nil
    public var size: String = "md"
    public var dot: String? = nil
    public var decorative: Bool = true
    public var alt: String? = nil
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
