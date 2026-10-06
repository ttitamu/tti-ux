// TuxFooter.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFooter<Content: View>: View {
    public var name: String = "Texas"
    public var address: String = "Texas"
    public var phone: String = (979)
    public var logo: String = "/logo.svg"
    public var logoSize: Int = 80
    public var brandLockup: String = /TTI_white.png
    public var brandLockupAlt: String = "Texas"
    public var social: String = "()"
    public var columns: String = "()"
    public var tagline: String = "Coordinated"
    public var year: Int = ()
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
