// TuxFooter.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFooter<Content: View>: View {
    public var name: String
    public var address: String
    public var phone: String
    public var logo: String = "/logo.svg"
    public var logoSize: Int = 80
    public var brandLockup: String = "/TTI_white.png"
    public var brandLockupAlt: String
    public var social: String
    public var columns: String
    public var tagline: String
    public var year: Int
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
