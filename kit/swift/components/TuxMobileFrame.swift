// TuxMobileFrame.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMobileFrame<Content: View>: View {
    public var platform: String = "ios"
    public var width: Int = 280
    public var color: String = undefined
    public var statusBar: Bool = true
    public var time: String = "9:41"
    public var notch: Bool = true
    public var homeIndicator: Bool = true
    public var navStyle: String = "gesture"
    public var ariaLabel: String = "undefined"
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
