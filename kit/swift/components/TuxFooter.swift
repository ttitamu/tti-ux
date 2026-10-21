// TuxFooter.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFooter<Content: View>: View {
    public var name: String = "Texas A&M Transportation Institute"
    public var address: String = "Texas A&M Transportation Institute\nCollege Station, TX 77843"
    public var phone: String = "(979) 317-2000"
    public var logo: String = "/logo.svg"
    public var logoSize: Int = 80
    public var brandLockup: String = "/TTI_white.png"
    public var brandLockupAlt: String = "Texas A&M Transportation Institute"
    public var social: String? = nil
    public var columns: String? = nil
    public var tagline: String = "Coordinated Statewide Transportation Research Program"
    public var year: Int? = nil
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
