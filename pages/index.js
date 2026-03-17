import React, {
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import {
  FiShield,
  FiGlobe,
  FiDatabase,
  FiLayers,
  FiZap,
  FiLock,
  FiTrendingUp,
  FiCheckCircle,
  FiArrowRight,
  FiExternalLink,
  FiChevronRight,
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";

// Lazy load components to reduce initial bundle size
const Hero = lazy(() => import("../Components/Hero"));
const Card = lazy(() => import("../Components/Card"));
const PopUp = lazy(() => import("../Components/PopUp"));

// Loading fallback components
const HeroSkeleton = () => (
  <div className="animate-pulse bg-[#064e3b] h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="h-12 bg-green-200 rounded w-64 mx-auto mb-4"></div>
      <div className="h-4 bg-green-100 rounded w-96 mx-auto"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  </div>
);

/* ── Whitepaper data ────────────────────────────────────────────────── */
const SECTIONS = [
  {
    icon: FiGlobe,
    title: "The Problem",
    body: "Traditional crowdfunding platforms charge 5–10% in fees, suffer from geographical restrictions, lack transparency in fund usage, and depend on centralised intermediaries that can freeze accounts at will. Creators in developing nations are disproportionately affected.",
  },
  {
    icon: FiDatabase,
    title: "Our Solution",
    body: "Fundverse eliminates middlemen by deploying immutable smart contracts on Ethereum. Every donation flows directly to the campaign owner's wallet in real time — no escrow, no custodians, no hidden fees. Total cost: only the gas fee.",
  },
  {
    icon: FiShield,
    title: "Security Model",
    body: "The CrowdFunding.sol contract is audited, non-upgradeable, and uses battle-tested patterns. Funds are never stored in the contract — they are forwarded immediately, eliminating rug-pull vectors entirely.",
  },
  {
    icon: FiLayers,
    title: "Architecture",
    body: "A Next.js frontend connects to Ethereum through ethers.js and Web3Modal. Campaign images are stored on IPFS via Pinata, ensuring censorship-resistant content hosting and permanent data availability.",
  },
  {
    icon: FiZap,
    title: "Performance",
    body: "Static generation via Next.js, optimised font loading, lazy-loaded animations, and memoised components ensure sub-second page loads and silky-smooth 60fps interactions across all devices.",
  },
  {
    icon: FiLock,
    title: "Privacy & Ownership",
    body: "No KYC required. No personal data collected. Your wallet is your identity. Campaign creators retain full ownership of their content and funds at all times.",
  },
];

const ROADMAP = [
  {
    phase: "Phase 1 — Genesis",
    title: "Mainnet Launch",
    desc: "Core crowdfunding contract deployed. Campaign creation, direct donations, and visibility controls live on Ethereum mainnet.",
  },
  {
    phase: "Phase 2 — Expansion",
    title: "Multi-Chain & Milestones",
    desc: "Expansion to Polygon and Arbitrum for lower fees. Introduction of milestone-based fund release for increased donor confidence.",
  },
  {
    phase: "Phase 3 — Community",
    title: "DAO Governance",
    desc: "FVR governance token launch. Token holders vote on platform upgrades, featured campaigns, and treasury allocation.",
  },
  {
    phase: "Phase 4 — Scale",
    title: "SDK & Integrations",
    desc: "Open-source SDK for developers. White-label solution for organisations. Cross-chain bridge for seamless multi-network campaigns.",
  },
];

const FUNCTIONS = [
  {
    name: "createCampaign()",
    type: "write",
    desc: "Deploys a new campaign with title, description, image CID, target amount, and deadline timestamp.",
  },
  {
    name: "donateToCampaign()",
    type: "write",
    desc: "Accepts ETH and forwards it directly to the campaign owner. Records the donator address and amount.",
  },
  {
    name: "toggleHidden()",
    type: "write",
    desc: "Owner-only function. Toggles campaign visibility on the frontend while preserving on-chain data.",
  },
  {
    name: "getCampaigns()",
    type: "read",
    desc: "Returns all campaigns as a struct array. View function — zero gas cost when called off-chain.",
  },
  {
    name: "getDonators()",
    type: "read",
    desc: "Returns parallel arrays of donator addresses and their corresponding donation amounts for a campaign.",
  },
];

/* ─── Section header component ──────────────────────────────────────── */
const SectionHead = React.memo(({ eyebrow, title, subtitle }) => (
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    {eyebrow && (
      <div className="sh-eyebrow">
        <span />
        {eyebrow}
      </div>
    )}
    {typeof title === "string" ? (
      <h2 className="sh-title" dangerouslySetInnerHTML={{ __html: title }} />
    ) : (
      <h2 className="sh-title">{title}</h2>
    )}
    <p className="sh-sub">{subtitle}</p>
  </div>
));

/* ─── Empty state ───────────────────────────────────────────────────── */
const EmptyState = ({ message }) => (
  <div
    style={{
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "60px 24px",
      background: "rgba(255,255,255,0.88)",
      border: "1px dashed rgba(16,185,129,0.25)",
      borderRadius: 20,
      fontFamily: "'Inter', sans-serif",
    }}
  >
    <div style={{ fontSize: 36, margin: "auto", marginBottom: 14 }}>🌿</div>
    <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500 }}>{message}</p>
  </div>
);

const wpStyles = `
  /* ── Hero banner card ──────────────────────────────────── */
  .wp-hero-banner {
    position: relative; padding: 40px 36px; border-radius: 28px; overflow: hidden; margin-bottom: 64px;
    background: linear-gradient(135deg, #064e3b 0%, #042f24 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 80px -15px rgba(0,0,0,0.3);
  }
  .wp-hero-banner::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  }
  .wp-hero-grid {
    display: none;
  }
  .wp-hero-content {
    position: relative; z-index: 1; display: flex; flex-direction: column; gap: 24px;
  }
  @media(min-width: 768px) {
    .wp-hero-content { flex-direction: row; align-items: center; gap: 48px; }
  }
  .wp-hero-left { flex: 1.2; text-align: left; }
  .wp-hero-right { flex: 0.8; }
  .wp-hero-tag {
    display: inline-flex; align-items: center; justify-content: flex-start; gap: 6px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #34d399; margin-bottom: 14px;
  }
  .wp-hero-tag span {
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 6px #10b981;
  }
  .wp-hero-h {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800;
    color: #fff; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 12px;
  }
  .wp-hero-h em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .wp-hero-p { font-size: 14px; color: rgba(167,243,208,0.6); line-height: 1.7; margin-bottom: 20px; }
  .wp-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .wp-hero-stat { text-align: center; padding: 16px 12px; border-radius: 16px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); }
  .wp-hero-stat-num { font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .wp-hero-stat-label { font-size: 10px; font-weight: 600; color: rgba(52,211,153,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
  
  .wp-hero-version {
    display: inline-flex; align-items: center; justify-content: flex-start; gap: 8px;
    padding: 10px 18px; border-radius: 12px;
    background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12);
    font-family: 'Courier New', monospace; font-size: 12px; color: rgba(167,243,208,0.5);
  }

  /* ── Numbered section ──────────────────────────────────── */
  .wp-numbered { counter-reset: wpsection; text-align: left;}
  .wp-section {
    counter-increment: wpsection; position: relative; padding: 32px 28px 32px 80px;
    background: rgba(4, 47, 36, 0.7); border: 1px solid rgba(16,185,129,0.15);
    border-radius: 20px; backdrop-filter: blur(12px); margin-bottom: 20px;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .wp-section:hover { transform: translateX(4px); border-color: rgba(16,185,129,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
  .wp-section::before {
    content: counter(wpsection, decimal-leading-zero); position: absolute; left: 24px; top: 32px;
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #10b981, #34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;
  }
  .wp-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.18); display: flex; align-items: center; justify-content: center;
    color: #34d399; font-size: 15px; margin-bottom: 12px;
  }
  .wp-section-title { font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .wp-section-body { font-size: 14px; color: rgba(167,243,208,0.6); line-height: 1.7; }



  /* ── Section heading ────────────────────────────────────────── */
  .ps-sh { text-align: center; margin-bottom: 44px; }
  .ps-sh-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 14px 4px 8px; border-radius: 999px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #34d399; margin-bottom: 14px;
  }
  .ps-sh-eyebrow span {
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.9);
  }
  .ps-sh-title {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), 'Inter', sans-serif;
    font-size: clamp(2.2rem, 4.8vw, 3.8rem); font-weight: 800;
    letter-spacing: -0.04em; color: #ffffff; margin-bottom: 2px;
  }
  .ps-sh-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ps-sh-sub { font-size: 15px; color: rgba(167,243,208,0.7); max-width: 520px; margin: 0 auto; line-height: 1.7; }

  /* ── Timeline & Glass ───────────────────────────────────────── */
  .ps-glass {
    background: linear-gradient(180deg, rgba(4, 47, 36, 0.8) 0%, rgba(13, 54, 39, 0.7) 100%);
    border: 1px solid rgba(16,185,129,0.22);
    border-radius: 26px; padding: 38px;
    box-shadow: 0 10px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
    text-align: left;
  }
  .ps-tl-desc { font-size: 14px; color: rgba(167,243,208,0.7); line-height: 1.7; }

  /* ── Roadmap ───────────────────────────────── */
  .rm-container {
    background: linear-gradient(160deg, #f7fffb 0%, #e6fff2 35%, #fff 65%, #f2fff8 100%);
    border-radius: 32px;
    padding: 32px 20px;
    box-shadow: 
      0 20px 48px -10px rgba(0,0,0,0.12),
      inset 0 0 0 1px rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.2);
    width: 100%;
    position: relative;
    text-align: left;
  }
  
  @media(min-width: 768px) {
    .rm-container {
      padding: 64px 40px;
      overflow-x: auto;
    }
  }

  .rm-container::-webkit-scrollbar { height: 6px; }
  .rm-container::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
  .rm-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

  .rm-timeline-h {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 20px;
    gap: 40px;
  }

  @media(min-width: 768px) {
    .rm-timeline-h {
      flex-direction: row;
      min-width: 900px;
      padding-left: 0;
      padding-top: 24px;
      gap: 32px;
    }
  }

  .rm-timeline-h::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 35px;
    width: 4px;
    background: linear-gradient(180deg, #10b981 0%, #d1fae5 100%);
    border-radius: 2px;
    z-index: 1;
  }

  @media(min-width: 768px) {
    .rm-timeline-h::before {
      top: 40px; bottom: auto; left: 0; right: 0;
      width: auto; height: 4px;
      background: linear-gradient(90deg, #10b981 0%, #d1fae5 100%);
    }
  }

  .rm-item-h {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    transition: transform 0.3s ease;
    padding-left: 48px;
  }

  @media(min-width: 768px) {
    .rm-item-h {
      padding-left: 0;
    }
  }

  .rm-item-h:hover { transform: translateY(-4px); }
  
  .rm-dot-h {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid #10b981;
    display: flex; align-items: center; justify-content: center;
    position: absolute;
    left: 1px; top: 0;
    z-index: 2;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    transition: all 0.3s ease;
  }

  @media(min-width: 768px) {
    .rm-dot-h {
      position: relative;
      left: auto; top: auto;
      margin-bottom: 24px;
    }
  }

  .rm-item-h:hover .rm-dot-h {
    background: #10b981;
    color: #fff;
    box-shadow: 0 0 15px rgba(16,185,129,0.5);
  }
  .rm-dot-icon { font-size: 14px; color: #10b981; transition: color 0.3s ease; }
  .rm-item-h:hover .rm-dot-icon { color: #ffffff; }

  .rm-phase-h {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #059669;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
  .rm-title-h {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #064e3b;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .rm-desc-h {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
  }

  /* ── Code block card — Home Version ────────────────────── */
  .pj-code {
    background: #ffffff;
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    text-align: left;
  }
  .pj-code-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px;
    background: #f8fafc;
    border-bottom: 1px solid rgba(16,185,129,0.1);
  }
  .pj-code-dots {
    display: flex; gap: 6px;
  }
  .pj-code-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }
  .pj-code-file {
    font-family: 'Courier New', monospace;
    font-size: 11px; color: #64748b;
  }
  .pj-code-body {
    padding: 24px;
    font-family: 'Courier New', monospace;
    font-size: 12.5px;
    line-height: 1.8;
    color: #334155;
    overflow-x: auto;
  }
  .pj-code-kw { color: #059669; font-weight: 700; }
  .pj-code-fn { color: #0891b2; font-weight: 600; }
  .pj-code-str { color: #0d9488; }
  .pj-code-cmt { color: #94a3b8; font-style: italic; }
  .pj-code-ln {
    display: inline-block; width: 30px; text-align: right;
    margin-right: 16px; color: #cbd5e1;
    user-select: none;
  }

  /* ── Function list — Home Version ──────────────────────── */
  .pj-fn {
    display: flex; align-items: flex-start; gap: 16px; flex-direction: column;
    padding: 20px 0;
    border-bottom: 1px solid rgba(16,185,129,0.08);
    transition: padding-left 0.3s ease;
    text-align: left;
  }
  @media(min-width: 640px) {
    .pj-fn { flex-direction: row; }
  }
  .pj-fn:last-child { border-bottom: none; }
  .pj-fn:hover { padding-left: 8px; }
  .pj-fn-badge {
    flex-shrink: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px; font-weight: 700;
    color: #ffffff;
    background: rgba(16,185,129,0.2);
    padding: 5px 12px; border-radius: 8px;
    border: 1px solid rgba(16,185,129,0.25);
    white-space: nowrap;
    transition: background 0.2s ease;
  }
  .pj-fn:hover .pj-fn-badge {
    background: rgba(16,185,129,0.15);
  }
  .pj-fn-desc {
    font-size: 14px; color: rgba(167,243,208,0.6); line-height: 1.65;
  }
  .pj-fn-type {
    display: inline-block;
    padding: 2px 8px; border-radius: 4px; margin-left: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .ps-grid-2 {
    display: grid; grid-template-columns: 1fr; gap: 32px;
  }
  @media(min-width: 1024px) {
    .ps-grid-2 { grid-template-columns: 1fr 1fr; }
  }
  .pj-fn-write {
    background: rgba(251,191,36,0.1); color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.2);
  }
  .pj-fn-read {
    background: rgba(16,185,129,0.1); color: #34d399;
    border: 1px solid rgba(16,185,129,0.15);
  }
`;

/* ═══════════════════════════════════════════════════════════════════════ */
const Index = () => {
  const {
    campaigns,
    getCampaigns,
    createCampaign,
    donate,
    currentAccount,
    toggleCampaignVisibility,
  } = useContext(CrowdFundingContext);

  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const userCampaigns = useMemo(() => {
    if (!currentAccount) return [];
    return campaigns.filter(
      (c) => c.owner.toLowerCase() === currentAccount.toLowerCase()
    );
  }, [campaigns, currentAccount]);

  const handleToggle = useCallback(
    async (id) => {
      try {
        await toggleCampaignVisibility(id);
      } catch (err) {
        /* Failed to toggle visibility: */
      }
    },
    [toggleCampaignVisibility]
  );

  const handleCreate = useCallback(
    async (formData) => {
      try {
        await createCampaign(formData);
      } catch (e) {
        /* Create campaign error: */
      }
    },
    [createCampaign]
  );
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <style>{wpStyles}</style>

      {/* ── Whitepaper / Protocol Info Section ───────────────────────────── */}
      <section className="pg-section" style={{ position: "relative" }}>
        <div className="pg-grid-bg" />
        <div
          className="pg-inner"
          style={{ textAlign: "center", paddingBottom: 0 }}
        >
          {/* ── Roadmap timeline ────────────────────────────────── */}
          <div style={{ marginBottom: 80 }}>
            <div className="ps-sh">
              <h2 className="ps-sh-title">
                Development <em>Roadmap</em>
              </h2>
              <p className="ps-sh-sub">
                Precision-engineered roadmap for the evolution of the protocol.
              </p>
            </div>

            <div className="rm-container">
              <div className="rm-timeline-h">
                {ROADMAP.map(({ phase, title, desc }) => (
                  <div key={phase} className="rm-item-h">
                    <div className="rm-dot-h">
                      <FiCheckCircle className="rm-dot-icon" />
                    </div>
                    <div className="rm-phase-h">{phase}</div>
                    <div className="rm-title-h">{title}</div>
                    <p className="rm-desc-h">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Smart Contract Code Preview ─────────────────────── */}
          <div style={{ marginBottom: 80 }}>
            <div className="ps-sh">
              <h2 className="ps-sh-title">
                Smart Contract <em>Preview</em>
              </h2>
              <p className="ps-sh-sub">
                An architectural review of the audited, gas-efficient core
                logic.
              </p>
            </div>

            <div
              className="ps-grid-2"
              style={{ maxWidth: 1100, margin: "0 auto" }}
            >
              {/* Code preview */}
              <div className="pj-code">
                <div className="pj-code-header">
                  <div className="pj-code-dots">
                    <div
                      className="pj-code-dot"
                      style={{ background: "#ef4444" }}
                    />
                    <div
                      className="pj-code-dot"
                      style={{ background: "#f59e0b" }}
                    />
                    <div
                      className="pj-code-dot"
                      style={{ background: "#10b981" }}
                    />
                  </div>
                  <span className="pj-code-file">CrowdFunding.sol</span>
                </div>
                <div className="pj-code-body">
                  <div>
                    <span className="pj-code-ln">1</span>
                    <span className="pj-code-cmt">
                      // SPDX-License-Identifier: UNLICENSED
                    </span>
                  </div>
                  <div>
                    <span className="pj-code-ln">2</span>
                    <span className="pj-code-kw">pragma</span> solidity ^0.8.28;
                  </div>
                  <div>
                    <span className="pj-code-ln">3</span>
                  </div>
                  <div>
                    <span className="pj-code-ln">4</span>
                    <span className="pj-code-kw">contract</span>{" "}
                    <span className="pj-code-fn">CrowdFunding</span> {"{"}
                  </div>
                  <div>
                    <span className="pj-code-ln">5</span>{" "}
                    <span className="pj-code-kw">struct</span>{" "}
                    <span className="pj-code-fn">Campaign</span> {"{"}
                  </div>
                  <div>
                    <span className="pj-code-ln">6</span> address owner;
                  </div>
                  <div>
                    <span className="pj-code-ln">7</span> string title;
                  </div>
                  <div>
                    <span className="pj-code-ln">8</span> uint256 target;
                  </div>
                  <div>
                    <span className="pj-code-ln">9</span> uint256 deadline;
                  </div>
                  <div>
                    <span className="pj-code-ln">10</span> uint256
                    amountCollected;
                  </div>
                  <div>
                    <span className="pj-code-ln">11</span>{" "}
                    <span className="pj-code-kw">bool</span> isHidden;
                  </div>
                  <div>
                    <span className="pj-code-ln">12</span> {"}"}
                  </div>
                  <div>
                    <span className="pj-code-ln">13</span>
                  </div>
                  <div>
                    <span className="pj-code-ln">14</span>{" "}
                    <span className="pj-code-kw">function</span>{" "}
                    <span className="pj-code-fn">donateToCampaign</span>(…)
                  </div>
                  <div>
                    <span className="pj-code-ln">15</span>{" "}
                    <span className="pj-code-kw">external payable</span>{" "}
                    {"{ … }"}
                  </div>
                </div>
              </div>

              {/* Function list */}
              <div className="ps-glass">
                <div
                  style={{
                    fontFamily:
                      'var(--font-bricolage, "Bricolage Grotesque"), sans-serif',
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 16,
                    textAlign: "left",
                  }}
                >
                  Public Interface
                </div>
                {FUNCTIONS.map(({ name, type, desc }) => (
                  <div key={name} className="pj-fn">
                    <div className="pj-fn-badge">{name}</div>
                    <div>
                      <p className="pj-fn-desc">
                        {desc}
                        <span
                          className={`pj-fn-type ${
                            type === "write" ? "pj-fn-write" : "pj-fn-read"
                          }`}
                        >
                          {type}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Campaigns */}
      {hasMounted && currentAccount && (
        <section
          className="pg-section pg-section-alt"
          style={{ position: "relative" }}
        >
          <div className="pg-grid-bg" />
          <div className="pg-inner" style={{ position: "relative", zIndex: 1 }}>
            <SectionHead
              eyebrow="Your Portfolio"
              title="Your <em>Campaigns</em>"
              subtitle="Campaigns you've created — manage, track donations, and toggle visibility."
            />
            <div className="pg-card-grid">
              {userCampaigns.length > 0 ? (
                userCampaigns.map((c, i) => (
                  <Suspense key={c.id} fallback={<CardSkeleton />}>
                    <Card
                      campaign={c}
                      setOpenModel={setOpenModel}
                      setDonate={setDonateCampaign}
                      onToggleHidden={handleToggle}
                      currentAccount={currentAccount}
                      priority={i < 3}
                    />
                  </Suspense>
                ))
              ) : (
                <EmptyState message="You haven't created any campaigns yet. Launch your first one above!" />
              )}
            </div>
          </div>
        </section>
      )}

      {openModel && donateCampaign && (
        <Suspense fallback={null}>
          <PopUp
            setOpenModel={setOpenModel}
            donate={donateCampaign}
            donateFunction={donate}
          />
        </Suspense>
      )}
    </>
  );
};

export default Index;
