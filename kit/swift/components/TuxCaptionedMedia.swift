// TuxCaptionedMedia.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCaptionedMedia<Content: View>: View {
    public var src: String? = nil
    public var alt: String = ""
    public var caption: String? = nil
    public var credit: String? = nil
    public var eyebrow: String? = nil
    public var aspect: String = "16/9"
    public var align: String = "full"
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
