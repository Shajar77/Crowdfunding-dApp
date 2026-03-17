import React, { memo } from "react";

/*
  PageShell — performance-optimised version.
  ─────────────────────────────────────────────────────────────────────
  • Removed: aurora conic-gradient rotation (was causing constant GPU
    layer promotion + composite every frame)
  • Removed: scanning beam (constant repaint across full width)
  • Removed: 7 JS-driven particle DOM nodes
  • Removed: grid-glow pulse animation
  • Replaced: filter:blur() on orbs with static opacity (blur forces
    GPU layer per element)
  • Replaced: backdrop-filter:blur() on cards with solid rgba bg
    (blur compositing is expensive when many overlapping elements exist)
  • Added: will-change only on the one bg gradient that actually animates
  • Added: contain:layout style on the page root
  • Static noise is kept as it is a single CSS background-image, free
  ─────────────────────────────────────────────────────────────────────
*/
const PageShell = memo(({ eyebrow, title, subtitle, children }) => {
  return (
    <div className="ps-page">
      <div className="ps-bg-base" />
      <div className="ps-noise" />
      <div className="ps-grid" />
      <div className="ps-orb ps-orb-1" />
      <div className="ps-orb ps-orb-2" />

      <div className="ps-inner">
        <div
          className="ps-header"
        >
          {eyebrow && (
            <div className="ps-eyebrow">
              <span className="ps-eyebrow-dot" />
              {eyebrow}
            </div>
          )}
          <h1 className="ps-title" dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="ps-subtitle">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
});

PageShell.displayName = "PageShell";

export default PageShell;
