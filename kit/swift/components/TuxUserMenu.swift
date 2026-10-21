// TuxUserMenu.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxUserMenu<Content: View>: View {
    public var state: String? = nil
    public var identity: String? = nil
    public var signInHref: String? = nil
    public var signInLabel: String = "Sign in"
    public var items: String? = nil
    public var prefs: String? = nil
    public var showSignOut: Bool = true
    public var placement: String = "cluster"
    public var statusLine: String? = nil
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
