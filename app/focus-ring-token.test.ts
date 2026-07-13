import { readFileSync } from "fs";
import path from "path";

const globalsCss = readFileSync(path.join(__dirname, "globals.css"), "utf8");

describe("focus ring tokens", () => {
  it("defines shared focus ring tokens", () => {
    expect(globalsCss).toContain("--focus-ring: 2px solid var(--accent);");
    expect(globalsCss).toContain("--focus-ring-offset: 2px;");
  });

  it("uses the shared tokens for every focus outline declaration", () => {
    const focusBlocks =
      globalsCss.match(/[^{}]*:focus(?:-visible)?\s*\{[^}]*\}/g) ?? [];

    expect(focusBlocks.length).toBeGreaterThan(0);
    for (const block of focusBlocks) {
      if (block.includes("outline:")) {
        expect(block).toContain("outline: var(--focus-ring);");
        expect(block).toContain("outline-offset: var(--focus-ring-offset);");
      }
    }
  });
});
