/**
 * TuxHeroCanvasSol — High-Performance Computing Cluster & Sol Celestial Hero Canvas.
 *
 * React port of app/components/TuxHeroCanvasSol.vue.
 * Dedicated sub-component of TuxHeroCanvas for research briefs, high-performance
 * computing clusters, and celestial/tensor network presentations.
 */
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import "./tux-hero-canvas-sol.css";

export type TuxHeroCanvasSolBlend = "seamless" | "contained" | "full-bleed";
export type TuxHeroCanvasSolMode = "cinematic-dark" | "adaptive";

export interface TuxHeroCanvasSolProps extends HTMLAttributes<HTMLDivElement> {
  /** Bottom edge blend style. 'seamless' dissolves softly into host page surface. */
  blend?: TuxHeroCanvasSolBlend;
  /** Whether cursor proximity highlights nodes and repels particles. */
  interactive?: boolean;
  /** Whether to render the accessible Play/Pause toggle button. */
  showControls?: boolean;
  /** Minimum height of the hero canvas stage (e.g. '32rem', '36rem', '600px'). */
  minHeight?: string;
  /** Presentation mode: 'adaptive' (Default) or 'cinematic-dark'. */
  mode?: TuxHeroCanvasSolMode;
  children?: ReactNode;
}

export const TuxHeroCanvasSol = forwardRef<HTMLDivElement, TuxHeroCanvasSolProps>(
  function TuxHeroCanvasSol(
    {
      blend = "seamless",
      interactive = true,
      showControls = true,
      minHeight = "34rem",
      mode = "adaptive",
      children,
      className = "",
      style,
      onMouseMove,
      onMouseLeave,
      ...restProps
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(() => {
      if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      return true;
    });
    const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -9999,
      y: -9999,
      active: false,
    });

    function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
      onMouseMove?.(e);
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }

    function handleMouseLeave(e: ReactMouseEvent<HTMLDivElement>) {
      onMouseLeave?.(e);
      mousePosRef.current = { x: -9999, y: -9999, active: false };
    }

    useEffect(() => {
      if (!isPlaying || typeof window === "undefined") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      let ctx: CanvasRenderingContext2D | null = null;
      try {
        ctx = canvas.getContext("2d");
      } catch {
        ctx = null;
      }
      if (!ctx) return;

      let animId: number | null = null;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect() ?? { width: 800, height: 540 };
      const w = Math.max(rect.width, 320);
      const h = Math.max(rect.height, 240);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      let breathPhase = 0;
      const renderStep = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        breathPhase += 0.022;
        if (breathPhase > Math.PI * 200) breathPhase = 0;
        animId = window.requestAnimationFrame(renderStep);
      };

      animId = window.requestAnimationFrame(renderStep);
      return () => {
        if (animId !== null) window.cancelAnimationFrame(animId);
      };
    }, [isPlaying, mode]);

    const rootClasses = [
      "tux-hero-canvas",
      "tux-hero-canvas-sol",
      `tux-hero-canvas--blend-${blend}`,
      `tux-hero-canvas-sol--blend-${blend}`,
      `tux-hero-canvas-sol--mode-${mode}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={rootClasses}
        style={{ minHeight, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...restProps}
      >
        <canvas
          ref={canvasRef}
          className="tux-hero-canvas__layer tux-hero-canvas-sol__layer"
          aria-hidden="true"
        />

        {blend === "seamless" && (
          <div
            className="tux-hero-canvas__bottom-bleed tux-hero-canvas-sol__bottom-bleed"
            aria-hidden="true"
          />
        )}

        {showControls && (
          <div className="tux-hero-canvas__controls tux-hero-canvas-sol__controls">
            <button
              type="button"
              className="tux-hero-canvas__playback-btn tux-hero-canvas-sol__playback-btn"
              aria-label={isPlaying ? "Pause interactive animation" : "Play interactive animation"}
              title={isPlaying ? "Pause animation" : "Play animation"}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              <span className="sr-only">
                {isPlaying ? "Pause animation" : "Play animation"}
              </span>
            </button>
          </div>
        )}

        <div className="tux-hero-canvas__content tux-hero-canvas-sol__content">
          {children}
        </div>
      </div>
    );
  },
);

export default TuxHeroCanvasSol;
