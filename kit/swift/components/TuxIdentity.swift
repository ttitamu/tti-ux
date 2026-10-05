// TuxIdentity.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxIdentity<Content: View>: View {
    public var name: String
    public var superhead: String = null
    public var level: String = institution
    public var orientation: String = horizontal
    public var kind: String = lockup
    public var href: String = null
    public var logoSize: Int = 0
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
