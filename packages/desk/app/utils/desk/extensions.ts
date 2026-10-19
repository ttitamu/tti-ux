import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import { DeskModule, DeskVideo, DeskVimeo } from "./nodes";

export const deskRenderExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
    },
  }),
  Image.configure({
    inline: false,
    allowBase64: false,
  }),
  Youtube.configure({
    modestBranding: true,
    nocookie: true,
    controls: true,
    width: 640,
    height: 360,
  }),
  DeskVideo,
  DeskVimeo,
  DeskModule,
];
