"use client";

import { useId, useState, type KeyboardEvent } from "react";

const statusBadgeCopy = {
  active: "Active",
  draft: "Draft",
  ended: "Ended",
  paused: "Paused",
} as const;

export type StreamStatus = keyof typeof statusBadgeCopy;

const statusBadgeDescription: Record<StreamStatus, string> = {
  active: "Active streams are funded and currently accruing toward the recipient.",
  draft: "Draft streams are saved but have not started accruing payments yet.",
  ended: "Ended streams are complete and no longer accrue new payments.",
  paused: "Paused streams are temporarily stopped and can resume when unpaused.",
};

/**
 * Distinct glyph per status so the state is conveyed by **shape as well as
 * colour**. This keeps the badge legible for users with colour-vision
 * deficiency and passes colour-blind simulator checks (the shapes remain
 * distinguishable under protanopia/deuteranopia/tritanopia).
 *
 * - active  → ▶ play (flowing)
 * - paused  → ‖ two bars (paused)
 * - ended   → ■ filled square (stopped)
 * - draft   → ○ hollow circle (not started)
 */
const statusBadgeGlyph: Record<StreamStatus, string> = {
  active: "▶",
  paused: "‖",
  ended: "■",
  draft: "○",
};

type StatusBadgeProps = {
  status: StreamStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const label = statusBadgeCopy[status];
  const description = statusBadgeDescription[status];
  const popoverId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
    }
  }

  return (
    <span className="status-badge-wrap">
      <button
        aria-describedby={isOpen ? popoverId : undefined}
        aria-expanded={isOpen}
        aria-label={`Stream status: ${label}`}
        className={`status-badge status-badge--${status}`}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {/* Decorative shape icon — the text label already conveys the status to
            assistive tech, so the glyph is hidden from screen readers. */}
        <span className={`status-icon status-icon--${status}`} aria-hidden="true">
          {statusBadgeGlyph[status]}
        </span>
        {label}
      </button>
      {isOpen ? (
        <span className="status-badge-popover" id={popoverId} role="tooltip">
          {description}
        </span>
      ) : null}
    </span>
  );
}