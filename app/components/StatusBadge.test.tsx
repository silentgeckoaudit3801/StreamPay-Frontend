/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from "@testing-library/react";
const { screen } = require("@testing-library/react") as any;
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["draft", "Draft"],
    ["active", "Active"],
    ["paused", "Paused"],
    ["ended", "Ended"],
  ] as const)("renders the %s variant with an accessible label", (status, label) => {
    render(<StatusBadge status={status} />);

    const badge = screen.getByLabelText(`Stream status: ${label}`);

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(label);
    expect(badge).toHaveClass(`status-badge--${status}`);
    expect(badge).toHaveAttribute("aria-expanded", "false");
  });

  it.each(["draft", "active", "paused", "ended"] as const)(
    "renders a decorative shape icon for %s (color is not the only differentiator)",
    (status) => {
      const { container } = render(<StatusBadge status={status} />);
      const icon = container.querySelector(`.status-icon--${status}`);

      expect(icon).not.toBeNull();
      // The shape is decorative; the text label conveys status to AT.
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect((icon?.textContent ?? "").length).toBeGreaterThan(0);
    }
  );

  it("uses distinct glyphs across statuses", () => {
    const glyphs = (["draft", "active", "paused", "ended"] as const).map((status) => {
      const { container } = render(<StatusBadge status={status} />);
      return container.querySelector(`.status-icon--${status}`)?.textContent;
    });
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  it("opens the status explanation with click and wires aria-describedby", () => {
    render(<StatusBadge status="active" />);

    const badge = screen.getByRole("button", { name: "Stream status: Active" });
    fireEvent.click(badge);

    const popover = screen.getByRole("tooltip");
    expect(popover).toHaveTextContent("Active streams are funded");
    expect(badge).toHaveAttribute("aria-expanded", "true");
    expect(badge).toHaveAttribute("aria-describedby", popover.id);
  });

  it("opens by keyboard activation and closes on Escape", () => {
    render(<StatusBadge status="paused" />);

    const badge = screen.getByRole("button", { name: "Stream status: Paused" });
    fireEvent.keyDown(badge, { key: "Enter" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("temporarily stopped");

    fireEvent.keyDown(badge, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the status explanation with the Space key", () => {
    render(<StatusBadge status="draft" />);

    const badge = screen.getByRole("button", { name: "Stream status: Draft" });
    fireEvent.keyDown(badge, { key: " " });
    expect(screen.getByRole("tooltip")).toHaveTextContent("have not started");

    fireEvent.keyDown(badge, { key: " " });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});