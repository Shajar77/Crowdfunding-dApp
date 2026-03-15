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
const shellStyles = `
  .ps-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    contain: layout style;
  }

  /* ── Gradient base (single animating layer) ─────────────────── */
  .ps-bg-base {
    position: absolute; inset: 0; z-index: 0;
    background: linear-gradient(160deg,
      #f7fffb 0%, #e6fff2 35%, #ffffff 60%, #f2fff8 100%
    );
    background-size: 220% 220%;
    will-change: background-position;
    animation: psGrad 18s ease infinite;
  }
  @keyframes psGrad {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* ── Static noise (no animation, just texture) ──────────────── */
  .ps-noise {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  /* ── Grid lines (static, GPU-composited) ────────────────────── */
  .ps-grid {
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background-image:
      linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, #000 0%, transparent 85%);
  }

  /* ── Ambient orbs — static opacity, no blur (blur = expensive) ─ */
  .ps-orb {
    position: absolute; border-radius: 50%;
    pointer-events: none; z-index: 1;
  }
  .ps-orb-1 {
    width: 760px; height: 600px; top: -240px; left: -180px;
    background: radial-gradient(circle,
      rgba(16,185,129,0.16) 0%,
      rgba(52,211,153,0.07) 45%,
      transparent 70%
    );
    opacity: 0.95;
  }
  .ps-orb-2 {
    width: 600px; height: 500px; bottom: -150px; right: -120px;
    background: radial-gradient(circle,
      rgba(52,211,153,0.12) 0%,
      rgba(16,185,129,0.06) 45%,
      transparent 70%
    );
    opacity: 0.85;
  }

  /* ── Inner container ────────────────────────────────────────── */
  .ps-inner {
    position: relative; z-index: 5;
    max-width: 1280px; margin: 0 auto;
    padding: 120px 24px 80px;
  }
  @media(min-width: 768px) {
    .ps-inner { padding: 140px 40px 100px; }
  }

  /* ── Page header ────────────────────────────────────────────── */
  .ps-header { text-align: center; margin-bottom: 64px; }

  .ps-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px 6px 10px; border-radius: 999px; margin-bottom: 20px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.22);
    font-size: 11px; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #047857;
  }
  .ps-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px rgba(16,185,129,0.7);
    flex-shrink: 0;
  }
  .ps-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), 'Inter', sans-serif;
    font-size: clamp(2.5rem, 5.2vw, 4rem); font-weight: 800;
    letter-spacing: -0.045em; line-height: 1.04;
    color: #053f2f; margin-bottom: 16px;
  }
  .ps-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ps-subtitle {
    font-size: 17px; color: #6b7280; font-weight: 400;
    max-width: 620px; margin: 0 auto; line-height: 1.75;
  }

  /* ── Divider ────────────────────────────────────────────────── */
  .ps-divider {
    height: 1px; margin: 64px auto;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.22), transparent);
  }

  /* ── Glass card (solid bg — no backdrop-filter) ─────────────── */
  .ps-glass {
    background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,255,251,0.92) 100%);
    border: 1px solid rgba(16,185,129,0.18);
    border-radius: 26px; padding: 38px;
    box-shadow: 0 10px 32px rgba(6,78,59,0.10), inset 0 1px 0 rgba(255,255,255,0.95);
  }

  /* ── Feature card ───────────────────────────────────────────── */
  .ps-feature {
    position: relative;
    background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,255,251,0.93) 100%);
    border: 1px solid rgba(16,185,129,0.18);
    border-radius: 26px; padding: 34px 30px;
    box-shadow: 0 8px 26px rgba(6,78,59,0.08), inset 0 1px 0 rgba(255,255,255,0.95);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .ps-feature:hover {
    transform: translateY(-6px);
    border-color: rgba(16,185,129,0.35);
    box-shadow: 0 20px 52px rgba(6,78,59,0.14), inset 0 1px 0 rgba(255,255,255,0.95);
  }
  .ps-feature-icon {
    width: 48px; height: 48px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.07));
    border: 1px solid rgba(16,185,129,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #10b981; font-size: 20px; margin-bottom: 18px;
    transition: transform 0.25s ease;
  }
  .ps-feature:hover .ps-feature-icon { transform: scale(1.08) rotate(-3deg); }
  .ps-feature-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), 'Inter', sans-serif;
    font-size: 18px; font-weight: 800;
    color: #064e3b; letter-spacing: -0.025em; margin-bottom: 10px;
  }
  .ps-feature-desc { font-size: 14px; line-height: 1.7; color: #6b7280; }

  /* ── Grid layouts ───────────────────────────────────────────── */
  .ps-grid-2 { display: grid; grid-template-columns: 1fr; gap: 24px; }
  @media(min-width:768px) { .ps-grid-2 { grid-template-columns: 1fr 1fr; } }

  .ps-grid-3 { display: grid; grid-template-columns: 1fr; gap: 24px; }
  @media(min-width:640px)  { .ps-grid-3 { grid-template-columns: 1fr 1fr; } }
  @media(min-width:1024px) { .ps-grid-3 { grid-template-columns: 1fr 1fr 1fr; } }

  .ps-grid-4 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(min-width:768px)  { .ps-grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; } }

  /* ── Stat card ──────────────────────────────────────────────── */
  .ps-stat {
    text-align: center; padding: 30px 16px;
    background: linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,255,251,0.9) 100%);
    border: 1px solid rgba(16,185,129,0.16);
    border-radius: 22px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .ps-stat:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(6,78,59,0.10); }
  .ps-stat-num {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), 'Inter', sans-serif;
    font-size: 32px; font-weight: 800;
    background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 6px;
  }
  .ps-stat-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af;
  }

  /* ── Section heading ────────────────────────────────────────── */
  .ps-sh { text-align: center; margin-bottom: 44px; }
  .ps-sh-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 14px 4px 8px; border-radius: 999px;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.14);
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #047857; margin-bottom: 14px;
  }
  .ps-sh-eyebrow span {
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.7);
  }
  .ps-sh-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), 'Inter', sans-serif;
    font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 800;
    letter-spacing: -0.035em; color: #064e3b; margin-bottom: 12px;
  }
  .ps-sh-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ps-sh-sub { font-size: 15px; color: #6b7280; max-width: 520px; margin: 0 auto; line-height: 1.7; }

  /* ── Timeline ───────────────────────────────────────────────── */
  .ps-timeline { position: relative; padding-left: 36px; }
  .ps-timeline::before {
    content: ''; position: absolute; left: 12px; top: 8px; bottom: 8px;
    width: 2px;
    background: linear-gradient(to bottom, #10b981, rgba(16,185,129,0.07));
    border-radius: 999px;
  }
  .ps-tl-item { position: relative; padding-bottom: 36px; }
  .ps-tl-item:last-child { padding-bottom: 0; }
  .ps-tl-dot {
    position: absolute; left: -31px; top: 5px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #10b981; border: 3px solid #f0fdf4;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
  }
  .ps-tl-phase { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #10b981; margin-bottom: 5px; }
  .ps-tl-title { font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif; font-size: 18px; font-weight: 800; color: #064e3b; margin-bottom: 7px; }
  .ps-tl-desc { font-size: 14px; color: #6b7280; line-height: 1.7; }

  /* ── Team member card ───────────────────────────────────────── */
  .ps-member {
    text-align: center;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(16,185,129,0.13);
    border-radius: 24px; padding: 36px 24px 28px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .ps-member:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(6,78,59,0.08); }
  .ps-member-avatar {
    width: 88px; height: 88px; border-radius: 50%;
    margin: 0 auto 18px;
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    border: 3px solid rgba(255,255,255,0.9);
    box-shadow: 0 4px 16px rgba(16,185,129,0.22);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 800; color: #fff;
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    transition: transform 0.25s ease;
  }
  .ps-member:hover .ps-member-avatar { transform: scale(1.06); }
  .ps-member-name { font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif; font-size: 18px; font-weight: 800; color: #064e3b; margin-bottom: 4px; }
  .ps-member-role { font-size: 12px; font-weight: 700; color: #10b981; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; }
  .ps-member-bio { font-size: 13.5px; color: #6b7280; line-height: 1.65; }
  .ps-member-socials { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
  .ps-member-social {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(16,185,129,0.07);
    border: 1px solid rgba(16,185,129,0.14);
    display: flex; align-items: center; justify-content: center;
    color: #047857; font-size: 13px; text-decoration: none;
    transition: all 0.2s ease;
  }
  .ps-member-social:hover {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16,185,129,0.28);
  }

  /* ── CTA ────────────────────────────────────────────────────── */
  .ps-cta {
    position: relative;
    text-align: center; padding: 58px 36px;
    border-radius: 30px; overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,255,251,0.9) 100%);
    border: 1px solid rgba(16,185,129,0.22);
    box-shadow: 0 14px 44px rgba(6,78,59,0.10), inset 0 1px 0 rgba(255,255,255,0.95);
    margin-top: 64px;
  }
  .ps-cta::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #10b981 30%, #34d399 50%, #059669 70%, transparent);
  }
  .ps-cta-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800;
    color: #064e3b; margin-bottom: 12px; letter-spacing: -0.03em;
  }
  .ps-cta-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ps-cta-sub { font-size: 15px; color: #6b7280; margin-bottom: 28px; max-width: 460px; margin-left: auto; margin-right: auto; line-height: 1.7; }
  .ps-cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 40px; border-radius: 18px;
    border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, #10b981 0%, #059669 70%, #047857 100%);
    box-shadow: 0 10px 28px rgba(16,185,129,0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;
  }
  .ps-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 42px rgba(16,185,129,0.45); }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Single <style> injected once at the document level via a module-level flag */
let _stylesInjected = false;

const PageShell = memo(({ eyebrow, title, subtitle, children }) => {
  // Inject once, not on every render
  if (typeof document !== "undefined" && !_stylesInjected) {
    const el = document.createElement("style");
    el.textContent = shellStyles;
    document.head.appendChild(el);
    _stylesInjected = true;
  }

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
