/**
 * @jest-environment jsdom
 */

import { copyText } from "./clipboard";

describe("copyText", () => {
  const originalClipboard = navigator.clipboard;
  const originalExecCommand = document.execCommand;

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
    document.execCommand = originalExecCommand;
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  it("uses navigator.clipboard when available", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    await copyText("GABC");

    expect(writeText).toHaveBeenCalledWith("GABC");
  });

  it("falls back to a temporary textarea when clipboard write fails", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("blocked"));
    const execCommand = jest.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    document.execCommand = execCommand;

    await copyText("GHTTP");

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("rejects when both copy paths fail", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    document.execCommand = jest.fn().mockReturnValue(false);

    await expect(copyText("GFAIL")).rejects.toThrow("Copy command failed");
    expect(document.querySelector("textarea")).toBeNull();
  });
});
