// TuxCommHero.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCommHero<Content: View>: View {
    public var eyebrow: String = "TEXAS"
    public var title: String
    public var accentTitle: String
    public var lead: String
    public var primaryActionText: String
    public var primaryActionTo: String
    public var primaryActionHref: String
    public var secondaryActionText: String
    public var secondaryActionTo: String
    public var secondaryActionHref: String
    public var imageSrc: String
    public var imageAlt: String = "TTI"
    public var imageBadge: String
    public var chamfer: Bool = true
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
