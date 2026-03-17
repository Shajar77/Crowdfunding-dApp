import React, { useContext, useMemo } from "react";
import Head from "next/head";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import PageShell from "../Components/PageShell";
import { Card } from "../Components";
import {
  FiCode, FiGitBranch, FiBox, FiActivity,
  FiFileText, FiTerminal, FiExternalLink,
  FiChevronRight
} from "react-icons/fi";
import { FaEthereum, FaReact } from "react-icons/fa";

/* ── Unique styles ────────────────────────────────────────────────── */
const projStyles = `
  .pj-wrap { display: flex; flex-direction: column; gap: 64px; }

  /* ── Architecture diagram ──────────────────────────────── */
  .pj-arch {
    position: relative;
    display: flex; flex-direction: column;
    gap: 16px;
    padding: 40px 32px;
    border-radius: 28px;
    overflow: hidden;
    background:
      radial-gradient(ellipse 60% 80% at 0% 0%, rgba(16,185,129,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 60% 60% at 100% 100%, rgba(52,211,153,0.10) 0%, transparent 55%),
      linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,255,251,0.95) 100%);
    border: 1px solid rgba(16,185,129,0.18);
    box-shadow:
      0 22px 70px -18px rgba(6,78,59,0.18),
      inset 0 1px 0 rgba(255,255,255,0.85);
    margin-bottom: 64px;
  }
  .pj-arch::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #10b981 30%, #34d399 50%, #059669 70%, transparent);
  }
  .pj-arch-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(6,95,70,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6,95,70,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000, transparent 75%);
  }
  .pj-arch-title {
    position: relative; z-index: 1;
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 20px; font-weight: 800; color: #fff;
    text-align: center; margin-bottom: 8px;
  }
  .pj-arch-sub {
    position: relative; z-index: 1;
    font-size: 13px; color: rgba(167,243,208,0.5);
    text-align: center; margin-bottom: 24px;
  }
  .pj-arch-title { color: #064e3b; }
  .pj-arch-sub { color: rgba(107,114,128,0.95); }
  .pj-arch-flow {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 12px;
    align-items: center;
  }
  @media(min-width: 768px) {
    .pj-arch-flow { flex-direction: row; gap: 0; justify-content: center; flex-wrap: wrap; }
  }
  .pj-arch-node {
    display: flex; flex-direction: column;
    align-items: center; gap: 8px;
    padding: 20px 24px;
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,255,251,0.92));
    border: 1px solid rgba(16,185,129,0.18);
    min-width: 130px;
    box-shadow: 0 10px 26px rgba(6,78,59,0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .pj-arch-node:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 42px rgba(6,78,59,0.14);
    border-color: rgba(16,185,129,0.30);
  }
  .pj-arch-node-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.10));
    border: 1px solid rgba(16,185,129,0.20);
    display: flex; align-items: center; justify-content: center;
    color: #059669; font-size: 18px;
  }
  .pj-arch-node-label {
    font-size: 12px; font-weight: 800; color: #064e3b;
    text-align: center;
  }
  .pj-arch-node-sub {
    font-size: 10px; color: rgba(6,95,70,0.58);
    text-align: center;
  }
  .pj-arch-arrow {
    display: flex;
    align-items: center;
    padding: 4px 0;
    color: rgba(6,95,70,0.35);
    transform: rotate(90deg);
  }
  @media(min-width: 768px) {
    .pj-arch-arrow { padding: 0 8px; transform: rotate(0deg); }
  }

  .pj-highlights {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: -24px;
    margin-bottom: 64px;
  }
  @media(min-width: 768px) { .pj-highlights { grid-template-columns: 1fr 1fr 1fr; } }
  .pj-hl {
    position: relative;
    padding: 18px 18px 16px;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,255,251,0.92));
    border: 1px solid rgba(16,185,129,0.16);
    box-shadow: 0 10px 28px rgba(6,78,59,0.08);
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .pj-hl::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 15% 20%, rgba(16,185,129,0.10), transparent 55%);
    pointer-events: none;
  }
  .pj-hl:hover { transform: translateY(-3px); box-shadow: 0 18px 46px rgba(6,78,59,0.12); border-color: rgba(16,185,129,0.28); }
  .pj-hl-top { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .pj-hl-ico {
    width: 36px; height: 36px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.10));
    border: 1px solid rgba(16,185,129,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #059669;
  }
  .pj-hl-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 14px; font-weight: 900; color: #064e3b; letter-spacing: -0.02em;
  }
  .pj-hl-desc { position: relative; z-index: 1; font-size: 12.5px; color: #6b7280; line-height: 1.65; }

  .pj-tech .ps-feature {
    border-radius: 22px;
    box-shadow: 0 12px 36px rgba(6,78,59,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
    border: 1px solid rgba(16,185,129,0.16);
    overflow: hidden;
  }
  .pj-tech .ps-feature::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.65), rgba(52,211,153,0.65), transparent);
    opacity: 0.6;
  }
  .pj-tech .ps-feature-icon {
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.10));
    border: 1px solid rgba(16,185,129,0.18);
  }
  .pj-tech .ps-feature-title { font-size: 17px; }
  .pj-tech .ps-feature-desc { font-size: 13.5px; }

  .pj-repo {
    background:
      radial-gradient(ellipse 60% 90% at 0% 0%, rgba(16,185,129,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 70% 80% at 100% 100%, rgba(52,211,153,0.10) 0%, transparent 55%),
      linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,255,251,0.92) 100%);
  }
  .pj-repo .ps-cta-btn { box-shadow: 0 14px 34px rgba(16,185,129,0.32); }

`;

/* ── Data ────────────────────────────────────────────────── */
const TECH = [
  { icon: FaReact, name: "Next.js 16", desc: "React framework with SSR, file-based routing, and optimised production builds for blazing-fast delivery." },
  { icon: FiBox, name: "Ethers.js v6", desc: "Lightweight Ethereum library for wallet connections, contract interaction, and real-time event listening." },
  { icon: FiCode, name: "Solidity 0.8.28", desc: "Secure smart contracts with built-in overflow checks, custom events, and gas-optimised storage patterns." },
  { icon: FiTerminal, name: "Hardhat", desc: "Development environment for compiling, testing, deploying, and debugging smart contracts with full stack traces." },
  { icon: FiFileText, name: "Pinata (IPFS)", desc: "Decentralised storage for campaign images and metadata. Content is pinned for permanent, censorship-resistant availability." },
  { icon: FiActivity, name: "Framer Motion", desc: "Production-grade animation library for fluid page transitions, scroll reveals, and micro-interactions." },
];


const Project = () => {
  const { campaigns, currentAccount } = useContext(CrowdFundingContext);

  const liveCampaigns = useMemo(() =>
    campaigns.filter(c => !c.isHidden).slice(0, 3),
  [campaigns]);

  return (
    <>
      <Head>
        <title>Project — Fundverse</title>
        <meta name="description" content="Explore Fundverse architecture, smart contracts, and technology stack." />
      </Head>
      <style>{projStyles}</style>

      <PageShell
        eyebrow="Engineering"
        title="The <em>Project</em>"
        subtitle="An inside look at the architecture, smart contract design, and technology stack powering Fundverse."
      >
        <div className="pj-wrap">
        {/* ── Architecture diagram ────────────────────────────── */}
        <div
          className="pj-arch"
        >
          <div className="pj-arch-grid" />
          <div className="pj-arch-title">System Architecture</div>
          <div className="pj-arch-sub">End-to-end data flow from frontend to blockchain</div>
          <div className="pj-arch-flow">
            {[
              { icon: FaReact, label: "Next.js", sub: "Frontend" },
              { icon: FiBox, label: "Ethers.js", sub: "Provider" },
              { icon: FiCode, label: "Solidity", sub: "Contract" },
              { icon: FaEthereum, label: "Ethereum", sub: "L1 Chain" },
              { icon: FiFileText, label: "IPFS", sub: "Storage" },
            ].map(({ icon: Icon, label, sub }, i, arr) => (
              <React.Fragment key={label}>
                <div
                  className="pj-arch-node"
                >
                  <div className="pj-arch-node-icon"><Icon /></div>
                  <div className="pj-arch-node-label">{label}</div>
                  <div className="pj-arch-node-sub">{sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="pj-arch-arrow"><FiChevronRight size={18} /></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="pj-highlights">
          {[
            { icon: FiGitBranch, title: "Open-source by default", desc: "Transparent codebase designed for audits, contributions, and community trust." },
            { icon: FiFileText, title: "IPFS-backed media", desc: "Campaign content lives on decentralised storage for resilience and permanence." },
            { icon: FiActivity, title: "Real-time on-chain state", desc: "Campaigns, donations, and visibility are driven directly by smart contract data." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="pj-hl">
              <div className="pj-hl-top">
                <div className="pj-hl-ico"><Icon size={16} /></div>
                <div className="pj-hl-title">{title}</div>
              </div>
              <div className="pj-hl-desc">{desc}</div>
            </div>
          ))}
        </div>

        {/* ── Tech Stack ──────────────────────────────────────── */}
        <div className="pj-tech">
        <div className="ps-sh">
          <div className="ps-sh-eyebrow"><span /> Stack</div>
          <h2 className="ps-sh-title">Technology <em>Stack</em></h2>
          <p className="ps-sh-sub">Battle-tested tools chosen for performance, security, and developer experience.</p>
        </div>
        <div className="ps-grid-3" style={{ marginBottom: 64 }}>
          {TECH.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="ps-feature"
            >
              <div className="ps-feature-icon"><Icon /></div>
              <div className="ps-feature-title">{name}</div>
              <p className="ps-feature-desc">{desc}</p>
            </div>
          ))}
        </div>
        </div>




        {/* ── Live Campaigns ──────────────────────────────────── */}
        {liveCampaigns.length > 0 && (
          <>
            <div className="ps-divider" />
            <div>
              <div className="ps-sh">
                <div className="ps-sh-eyebrow"><span /> Live</div>
                <h2 className="ps-sh-title">Active <em>Campaigns</em></h2>
                <p className="ps-sh-sub">Currently running campaigns on the Fundverse protocol.</p>
              </div>
              <div className="ps-grid-3">
                {liveCampaigns.map((c) => (
                  <Card key={c.id} campaign={c} currentAccount={currentAccount} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div
          className="ps-cta pj-repo"
        >
          <h2 className="ps-cta-title">View on <em>GitHub</em></h2>
          <p className="ps-cta-sub">The full source code is open-source. Star the repo, report issues, or contribute.</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ps-cta-btn">
            <span><FiExternalLink size={16} /> Source Code</span>
          </a>
        </div>
        </div>
      </PageShell>
    </>
  );
};

export default Project;
