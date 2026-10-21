import React from "react";

export interface SpectrumBand {
  id: string;
  label: string;
  token: string;
  bgClass: string;
  hex: string;
}

export const TUX_SPECTRUM_BANDS: ReadonlyArray<SpectrumBand> = [
  { id: "maroon", label: "Maroon", token: "--spectrum-maroon", bgClass: "bg-spectrum-maroon", hex: "#500000" },
  { id: "blue", label: "Slate Blue", token: "--spectrum-blue", bgClass: "bg-spectrum-blue", hex: "#1B5E87" },
  { id: "teal", label: "Slate Teal", token: "--spectrum-teal", bgClass: "bg-spectrum-teal", hex: "#28616E" },
  { id: "green", label: "Sage Green", token: "--spectrum-green", bgClass: "bg-spectrum-green", hex: "#386B43" },
  { id: "gold", label: "Ochre Gold", token: "--spectrum-gold", bgClass: "bg-spectrum-gold", hex: "#85620A" },
];

export interface TuxSpectrumRibbonProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  rounded?: boolean;
  ariaLabel?: string;
  bands?: SpectrumBand[];
  className?: string;
}

export const TuxSpectrumRibbon: React.FC<TuxSpectrumRibbonProps> = ({
  size = "sm",
  orientation = "horizontal",
  showLabels = false,
  rounded = false,
  ariaLabel = "TTI Five-Color Brand Spectrum",
  bands = TUX_SPECTRUM_BANDS as unknown as SpectrumBand[],
  className = "",
}) => {
  return (
    <div
      className={`tux-spectrum-ribbon tux-spectrum-ribbon--${orientation} tux-spectrum-ribbon--${size} ${
        rounded ? "rounded-sm overflow-hidden" : ""
      } ${className}`.trim()}
      role={showLabels ? "region" : "presentation"}
      aria-label={showLabels ? ariaLabel : undefined}
      aria-hidden={!showLabels ? "true" : undefined}
    >
      <div
        className={`tux-spectrum-ribbon__bar ${
          orientation === "vertical" ? "flex-col h-full" : "flex-row w-full"
        } flex`}
      >
        {bands.map((band) => (
          <div
            key={band.id}
            className={`tux-spectrum-ribbon__segment flex-1 ${band.bgClass}`}
            style={{ backgroundColor: `var(${band.token}, ${band.hex})` }}
            title={showLabels ? band.label : undefined}
          />
        ))}
      </div>

      {showLabels && (
        <div className="tux-spectrum-ribbon__labels grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2 text-xs">
          {bands.map((band) => (
            <div key={`${band.id}-lbl`} className="flex items-center gap-1.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-xs flex-shrink-0 ${band.bgClass}`}
                style={{ backgroundColor: `var(${band.token}, ${band.hex})` }}
              />
              <span className="text-text-secondary font-medium truncate">
                {band.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TuxSpectrumRibbon;
