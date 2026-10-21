// TuxCookieConsent.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCookieConsent<Content: View>: View {
    public var storageKey: String = "tux-cookie-consent"
    public var position: String = "bottom-right"
    public var message: String = "We use cookies to keep you signed in, remember your preferences, and understand how the site is used. Necessary cookies are always on."
    public var privacyHref: String = "/privacy"
    public var initiallyExpanded: Bool = false
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
