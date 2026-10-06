// TuxCardCarousel.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCardCarousel<Content: View>: View {
    public var items: String = "undefined"
    public var eyebrow: String = "undefined"
    public var title: String = "undefined"
    public var bare: Bool = false
    public var arrows: Bool = true
    public var dots: Bool = false
    public var loop: Bool = false
    public var slidesToScroll: Int = 1
    public var align: String = start
    public var gap: String = "1rem"
    public var ariaLabel: String = "Carousel"
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
