import React from "react";
import Head from "next/head";
import PageShell from "../Components/PageShell";
import {
  FiShield, FiGlobe, FiDatabase, FiLayers,
  FiZap, FiLock, FiTrendingUp, FiCheckCircle,
  FiArrowRight, FiExternalLink
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";

/* ── Unique styles for this page ────────────────────────────────── */
const wpStyles = `
  /* ── Hero banner card ──────────────────────────────────── */
  .wp-hero-banner {
    position: relative;
    padding: 40px 36px;
    border-radius: 28px;
    overflow: hidden;
    margin-bottom: 64px;
    background:
      radial-gradient(ellipse 60% 80% at 0% 0%, rgba(16,185,129,0.12) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 100% 100%, rgba(52,211,153,0.08) 0%, transparent 50%),
      linear-gradient(135deg, #0a2e23 0%, #11291f 40%, #0d3627 100%);
    border: 1px solid rgba(16,185,129,0.25);
    box-shadow:
      0 25px 80px -15px rgba(0,0,0,0.5),
      0 0 0 1px rgba(16,185,129,0.15),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .wp-hero-banner::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #10b981 30%, #34d399 50%, #059669 70%, transparent);
  }
  .wp-hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 0%, transparent 70%);
    opacity: 0.5;
  }
  .wp-hero-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 24px;
  }
  @media(min-width: 768px) {
    .wp-hero-content {
      flex-direction: row; align-items: center; gap: 48px;
    }
  }
  .wp-hero-left { flex: 1.2; }
  .wp-hero-right { flex: 0.8; }
  .wp-hero-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.25);
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #34d399;
    margin-bottom: 14px;
  }
  .wp-hero-tag span {
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 6px #10b981;
  }
  .wp-hero-h {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800;
    color: #fff; line-height: 1.15; letter-spacing: -0.03em;
    margin-bottom: 12px;
  }
  .wp-hero-h em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .wp-hero-p {
    font-size: 14px; color: rgba(167,243,208,0.6); line-height: 1.7; margin-bottom: 20px;
  }
  .wp-hero-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  }
  .wp-hero-stat {
    text-align: center;
    padding: 16px 12px;
    border-radius: 16px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.15);
  }
  .wp-hero-stat-num {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 24px; font-weight: 800; color: #fff;
    margin-bottom: 2px;
  }
  .wp-hero-stat-label {
    font-size: 10px; font-weight: 600; color: rgba(52,211,153,0.5);
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .wp-hero-version {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 12px;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.12);
    font-family: 'Courier New', monospace;
    font-size: 12px; color: rgba(167,243,208,0.5);
  }

  /* ── Numbered section ──────────────────────────────────── */
  .wp-numbered {
    counter-reset: wpsection;
  }
  .wp-section {
    counter-increment: wpsection;
    position: relative;
    padding: 32px 28px 32px 80px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(16,185,129,0.12);
    border-radius: 20px;
    backdrop-filter: blur(12px);
    margin-bottom: 20px;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .wp-section:hover {
    transform: translateX(4px);
    border-color: rgba(16,185,129,0.3);
    box-shadow: 0 8px 32px rgba(6,78,59,0.06);
  }
  .wp-section::before {
    content: counter(wpsection, decimal-leading-zero);
    position: absolute; left: 24px; top: 32px;
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 28px; font-weight: 800;
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .wp-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.06));
    border: 1px solid rgba(16,185,129,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #10b981; font-size: 15px;
    margin-bottom: 12px;
  }
  .wp-section-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 18px; font-weight: 800;
    color: #064e3b; margin-bottom: 8px;
  }
  .wp-section-body {
    font-size: 14px; color: #6b7280; line-height: 1.7;
  }

  /* ── Token pie chart visual ────────────────────────────── */
  .wp-token-visual {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 24px;
    padding: 40px 24px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(16,185,129,0.12);
    border-radius: 24px;
    backdrop-filter: blur(12px);
  }
  @media(min-width: 768px) {
    .wp-token-visual { flex-direction: row; gap: 48px; }
  }
  .wp-token-ring {
    position: relative;
    width: 180px; height: 180px; flex-shrink: 0;
  }
  .wp-token-ring svg {
    transform: rotate(-90deg);
    filter: drop-shadow(0 4px 12px rgba(16,185,129,0.2));
  }
  .wp-token-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .wp-token-center-num {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 28px; font-weight: 800; color: #064e3b;
  }
  .wp-token-center-label {
    font-size: 10px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .wp-token-legend { display: flex; flex-direction: column; gap: 12px; }
  .wp-token-item {
    display: flex; align-items: center; gap: 12px;
  }
  .wp-token-swatch {
    width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0;
  }
  .wp-token-name {
    font-size: 14px; font-weight: 600; color: #064e3b;
    min-width: 120px;
  }
  .wp-token-pct {
    font-family: 'Courier New', monospace;
    font-size: 14px; font-weight: 700; color: #10b981;
  }
`;

/* ── Data ───────────────────────────────────────────────────── */
const SECTIONS = [
  {
    icon: FiGlobe, title: "The Problem",
    body: "Traditional crowdfunding platforms charge 5–10% in fees, suffer from geographical restrictions, lack transparency in fund usage, and depend on centralised intermediaries that can freeze accounts at will. Creators in developing nations are disproportionately affected.",
  },
  {
    icon: FiDatabase, title: "Our Solution",
    body: "Fundverse eliminates middlemen by deploying immutable smart contracts on Ethereum. Every donation flows directly to the campaign owner's wallet in real time — no escrow, no custodians, no hidden fees. Total cost: only the gas fee.",
  },
  {
    icon: FiShield, title: "Security Model",
    body: "The CrowdFunding.sol contract is audited, non-upgradeable, and uses battle-tested patterns. Funds are never stored in the contract — they are forwarded immediately, eliminating rug-pull vectors entirely.",
  },
  {
    icon: FiLayers, title: "Architecture",
    body: "A Next.js frontend connects to Ethereum through ethers.js and Web3Modal. Campaign images are stored on IPFS via Pinata, ensuring censorship-resistant content hosting and permanent data availability.",
  },
  {
    icon: FiZap, title: "Performance",
    body: "Static generation via Next.js, optimised font loading, lazy-loaded animations, and memoised components ensure sub-second page loads and silky-smooth 60fps interactions across all devices.",
  },
  {
    icon: FiLock, title: "Privacy & Ownership",
    body: "No KYC required. No personal data collected. Your wallet is your identity. Campaign creators retain full ownership of their content and funds at all times.",
  },
];

const ROADMAP = [
  { phase: "Phase 1 — Genesis", title: "Mainnet Launch", desc: "Core crowdfunding contract deployed. Campaign creation, direct donations, and visibility controls live on Ethereum mainnet." },
  { phase: "Phase 2 — Expansion", title: "Multi-Chain & Milestones", desc: "Expansion to Polygon and Arbitrum for lower fees. Introduction of milestone-based fund release for increased donor confidence." },
  { phase: "Phase 3 — Community", title: "DAO Governance", desc: "FVR governance token launch. Token holders vote on platform upgrades, featured campaigns, and treasury allocation." },
  { phase: "Phase 4 — Scale", title: "SDK & Integrations", desc: "Open-source SDK for developers. White-label solution for organisations. Cross-chain bridge for seamless multi-network campaigns." },
];

const TOKENS = [
  { name: "Community & Rewards", pct: "40%", color: "#10b981", offset: 0, length: 40 },
  { name: "Development Fund", pct: "25%", color: "#059669", offset: 40, length: 25 },
  { name: "Team (4yr vesting)", pct: "15%", color: "#047857", offset: 65, length: 15 },
  { name: "Ecosystem Grants", pct: "10%", color: "#34d399", offset: 80, length: 10 },
  { name: "Reserve", pct: "10%", color: "#6ee7b7", offset: 90, length: 10 },
];

const WhitePaper = () => {
  // Compute SVG donut chart
  const circumference = 2 * Math.PI * 70;

  return (
    <>
      <Head>
        <title>White Paper — Fundverse</title>
        <meta name="description" content="Read the Fundverse white paper — decentralized crowdfunding protocol built on Ethereum." />
      </Head>
      <style>{wpStyles}</style>

      <PageShell
        eyebrow="Documentation"
        title="White <em>Paper</em>"
        subtitle="A comprehensive look at the technology, vision, and roadmap powering the future of decentralized crowdfunding."
      >
        {/* ── Dark hero banner ─────────────────────────────────── */}
        <div
          className="wp-hero-banner"
        >
          <div className="wp-hero-grid" />
          <div className="wp-hero-content">
            <div className="wp-hero-left">
              <div className="wp-hero-tag"><span /> Protocol Overview</div>
              <h2 className="wp-hero-h">
                Trustless Crowdfunding for the <em>Decentralized Web</em>
              </h2>
              <p className="wp-hero-p">
                Fundverse leverages Ethereum smart contracts to create a zero-fee, non-custodial crowdfunding protocol where funds flow directly to creators — no intermediaries, no borders, no censorship.
              </p>
              <div className="wp-hero-version">
                <FiCheckCircle size={12} style={{ color: "#10b981" }} />
                Version 1.0 · Solidity 0.8.28 · Audited
              </div>
            </div>
            <div className="wp-hero-right">
              <div className="wp-hero-stats">
                {[
                  { num: "0%", label: "Fee" },
                  { num: "120", label: "LoC" },
                  { num: "∞", label: "Reach" },
                ].map(({ num, label }) => (
                  <div key={label} className="wp-hero-stat">
                    <div className="wp-hero-stat-num">{num}</div>
                    <div className="wp-hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Numbered protocol sections ───────────────────────── */}
        <div className="ps-sh">
          <div className="ps-sh-eyebrow"><span /> Deep Dive</div>
          <h2 className="ps-sh-title">Protocol <em>Breakdown</em></h2>
          <p className="ps-sh-sub">Six pillars that make Fundverse secure, fast, and borderless.</p>
        </div>

        <div className="wp-numbered" style={{ maxWidth: 780, margin: "0 auto 64px" }}>
          {SECTIONS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="wp-section"
            >
              <div className="wp-section-icon"><Icon /></div>
              <div className="wp-section-title">{title}</div>
              <p className="wp-section-body">{body}</p>
            </div>
          ))}
        </div>

        <div className="ps-divider" />

        {/* ── Roadmap timeline ────────────────────────────────── */}
        <div>
          <div className="ps-sh">
            <div className="ps-sh-eyebrow"><span /> Vision</div>
            <h2 className="ps-sh-title">Development <em>Roadmap</em></h2>
            <p className="ps-sh-sub">Our phased approach to building the most trusted crowdfunding protocol.</p>
          </div>

          <div className="ps-glass" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="ps-timeline">
              {ROADMAP.map(({ phase, title, desc }) => (
                <div
                  key={phase}
                  className="ps-tl-item"
                >
                  <div className="ps-tl-dot" />
                  <div className="ps-tl-phase">{phase}</div>
                  <div className="ps-tl-title">{title}</div>
                  <p className="ps-tl-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ps-divider" />

        {/* ── Tokenomics with donut chart ─────────────────────── */}
        <div>
          <div className="ps-sh">
            <div className="ps-sh-eyebrow"><span /> Economics</div>
            <h2 className="ps-sh-title">FVR <em>Tokenomics</em></h2>
            <p className="ps-sh-sub">The governance token that powers platform decisions and incentivises participation.</p>
          </div>

          <div className="wp-token-visual">
            {/* SVG donut chart */}
            <div className="wp-token-ring">
              <svg width="180" height="180" viewBox="0 0 180 180">
                {TOKENS.map(({ color, offset, length }, i) => (
                  <circle
                    key={i}
                    cx="90" cy="90" r="70"
                    fill="none"
                    stroke={color}
                    strokeWidth="18"
                    strokeDasharray={`${(length / 100) * circumference} ${circumference}`}
                    strokeDashoffset={`-${(offset / 100) * circumference}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                ))}
              </svg>
              <div className="wp-token-center">
                <div className="wp-token-center-num">1B</div>
                <div className="wp-token-center-label">Total Supply</div>
              </div>
            </div>

            {/* Legend */}
            <div className="wp-token-legend">
              {TOKENS.map(({ name, pct, color }) => (
                <div key={name} className="wp-token-item">
                  <div className="wp-token-swatch" style={{ background: color }} />
                  <span className="wp-token-name">{name}</span>
                  <span className="wp-token-pct">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div
          className="ps-cta"
        >
          <h2 className="ps-cta-title">Ready to <em>Build?</em></h2>
          <p className="ps-cta-sub">Start your first campaign and join thousands of creators building on-chain.</p>
          <a href="/" className="ps-cta-btn">
            <span><FaEthereum /> Launch App</span>
          </a>
        </div>
      </PageShell>
    </>
  );
};

export default WhitePaper;
