/**
 * TuxCodeBlock — standalone code block with caption, copy action, and line numbers.
 * React port of app/components/TuxCodeBlock.vue.
 */

import React, { forwardRef, useState, type HTMLAttributes } from "react";
import "./tux-code-block.css";

export interface TuxCodeBlockProps extends HTMLAttributes<HTMLElement> {
  /** Source code string. */
  code: string;
  /** Language identifier (ts, python, bash, json, etc.). */
  lang?: string;
  /** Optional caption or filename. */
  filename?: string;
  /** Show 1-indexed line numbers. */
  lineNumbers?: boolean;
  /** Hide the copy button. */
  noCopy?: boolean;
  /** Hide the download button. */
  noDownload?: boolean;
  /** Suggested download filename. */
  downloadName?: string;
  /** Pre-rendered highlighted HTML (optional Shiki/Prism output). */
  highlightedHtml?: string;
}

const LANG_EXT: Record<string, string> = {
  ts: "ts", tsx: "tsx", js: "js", jsx: "jsx", vue: "vue",
  python: "py", py: "py", rust: "rs", go: "go", java: "java",
  c: "c", cpp: "cpp", cs: "cs", rb: "rb", php: "php",
  bash: "sh", sh: "sh", zsh: "sh",
  yaml: "yml", yml: "yml", json: "json", toml: "toml",
  html: "html", css: "css", scss: "scss",
  md: "md", markdown: "md", sql: "sql", text: "txt",
};

export const TuxCodeBlock = forwardRef<HTMLElement, TuxCodeBlockProps>(
  function TuxCodeBlock(
    {
      code,
      lang = "text",
      filename,
      lineNumbers = false,
      noCopy = false,
      noDownload = false,
      downloadName,
      highlightedHtml,
      className = "",
      ...restProps
    },
    ref,
  ) {
    const [copied, setCopied] = useState(false);

    const resolvedDownloadName = (() => {
      if (downloadName) return downloadName;
      if (filename) {
        return filename.split("/").pop()!.split(":")[0]!;
      }
      const ext = LANG_EXT[lang] ?? "txt";
      return `code.${ext}`;
    })();

    const handleCopy = async () => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // ignore clipboard errors
        }
      }
    };

    const handleDownload = () => {
      if (typeof window === "undefined") return;
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resolvedDownloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const lines = code.split("\n");

    const classes = [
      "tux-codeblock",
      lineNumbers ? "tux-codeblock--with-lines" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <figure ref={ref} className={classes} {...restProps}>
        {filename && (
          <figcaption className="tux-codeblock__caption">
            <span className="tux-codeblock__filename">{filename}</span>
            {lang !== "text" && <span className="tux-codeblock__lang">{lang}</span>}
          </figcaption>
        )}

        <div className="tux-codeblock__body">
          {(!noCopy || !noDownload) && (
            <div className="tux-codeblock__actions">
              {!noDownload && (
                <button
                  type="button"
                  className="tux-codeblock__action"
                  aria-label={`Download ${resolvedDownloadName}`}
                  onClick={handleDownload}
                >
                  <svg
                    className="tux-codeblock__action-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
                </button>
              )}
              {!noCopy && (
                <button
                  type="button"
                  className="tux-codeblock__action"
                  aria-label={copied ? "Copied" : "Copy code"}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <svg
                      className="tux-codeblock__action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      className="tux-codeblock__action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>
          )}

          {highlightedHtml ? (
            <div
              className="tux-codeblock__rendered"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="tux-codeblock__fallback">
              <code>
                {lines.map((line, i) => (
                  <span key={i} className="tux-codeblock__line">
                    {lineNumbers && (
                      <span className="tux-codeblock__line-no" aria-hidden="true">
                        {i + 1}
                      </span>
                    )}
                    <span>{line}{"\n"}</span>
                  </span>
                ))}
              </code>
            </pre>
          )}
        </div>
      </figure>
    );
  },
);
