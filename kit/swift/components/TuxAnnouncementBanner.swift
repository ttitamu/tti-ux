// TuxAnnouncementBanner.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAnnouncementBanner<Content: View>: View {
    public var id: String = "undefined"
    public var tone: String = "info"
    public var icon: String = "undefined"
    public var eyebrow: String = "undefined"
    public var message: String = "undefined"
    public var action: String = "undefined"
    public var dismissable: Bool = true
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
