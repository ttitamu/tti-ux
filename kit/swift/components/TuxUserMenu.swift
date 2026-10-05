// TuxUserMenu.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxUserMenu<Content: View>: View {
    public var state: String
    public var identity: String = "undefined"
    public var signInHref: String = "undefined"
    public var signInLabel: String = "Sign"
    public var items: String = "()"
    public var prefs: String = "()"
    public var showSignOut: Bool = true
    public var placement: String = cluster
    public var statusLine: String = "undefined"
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
