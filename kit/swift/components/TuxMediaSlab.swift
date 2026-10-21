// TuxMediaSlab.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMediaSlab<Content: View>: View {
    public var src: String? = nil
    public var alt: String = ""
    public var eyebrow: String? = nil
    public var title: String? = nil
    public var dek: String? = nil
    public var layout: String = "overlay"
    public var imageSide: String = "right"
    public var height: String = "standard"
    public var tone: String = "maroon"
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
