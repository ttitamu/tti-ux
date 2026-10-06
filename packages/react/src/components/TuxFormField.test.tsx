import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxFormField } from "./TuxFormField";

describe("TuxFormField (React)", () => {
  it("renders label, required indicator, hint, and input", () => {
    const { container } = render(
      <TuxFormField
        label="Corridor Identifier"
        required
        hint="Six-digit numeric code assigned by TxDOT."
        inputId="corridor-id"
      >
        {({ inputId, ariaDescribedby, ariaRequired }) => (
          <input
            id={inputId}
            aria-describedby={ariaDescribedby}
            aria-required={ariaRequired}
            type="text"
          />
        )}
      </TuxFormField>,
    );

    const label = container.querySelector("label");
    expect(label).not.toBeNull();
    expect(label?.getAttribute("for")).toBe("corridor-id");
    expect(label?.textContent).toContain("Corridor Identifier");
    expect(label?.textContent).toContain("*");

    const hint = container.querySelector(".tux-form-field__hint");
    expect(hint).not.toBeNull();
    expect(hint?.getAttribute("id")).toBe("corridor-id-desc");
    expect(hint?.textContent).toContain("Six-digit numeric code");

    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-describedby")).toBe("corridor-id-desc");
    expect(input?.getAttribute("aria-required")).toBe("true");
  });

  it("renders validation error message and invalid styling", () => {
    const { container } = render(
      <TuxFormField
        label="Sensor Sampling Rate"
        error="Sampling rate must be between 10Hz and 100Hz."
        inputId="sampling-rate"
      >
        {({ inputId, ariaInvalid }) => (
          <input id={inputId} aria-invalid={ariaInvalid} type="number" />
        )}
      </TuxFormField>,
    );

    const field = container.querySelector(".tux-form-field");
    expect(field?.classList.contains("tux-form-field--invalid")).toBe(true);

    const error = container.querySelector('[role="alert"]');
    expect(error).not.toBeNull();
    expect(error?.textContent).toContain("Sampling rate must be between 10Hz");

    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  it("renders help trigger button when help text is provided", () => {
    const { container } = render(
      <TuxFormField
        label="Telemetry Port"
        help="Default MQTT telemetry port is 8883."
      >
        <input type="text" />
      </TuxFormField>,
    );

    const helpBtn = container.querySelector(".tux-form-field__help-trigger");
    expect(helpBtn).not.toBeNull();
    expect(helpBtn?.getAttribute("aria-label")).toBe("Help: Telemetry Port");
    expect(helpBtn?.getAttribute("title")).toBe("Default MQTT telemetry port is 8883.");
  });
});
