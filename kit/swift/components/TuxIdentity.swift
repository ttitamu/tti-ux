// TuxIdentity.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxIdentity<Content: View>: View {
    public var name: String? = nil
    public var superhead: String? = nil
    public var level: String = "institution"
    public var orientation: String = "horizontal"
    public var kind: String = "lockup"
    public var href: String? = nil
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
