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
  /* ── Architecture diagram ──────────────────────────────── */
  .pj-arch {
    position: relative;
    display: flex; flex-direction: column;
    gap: 16px;
    padding: 40px 32px;
    border-radius: 28px;
    overflow: hidden;
    background:
      radial-gradient(ellipse 60% 80% at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 100% 100%, rgba(52,211,153,0.06) 0%, transparent 50%),
      linear-gradient(135deg, #0a2e23 0%, #11291f 40%, #0d3627 100%);
    border: 1px solid rgba(16,185,129,0.25);
    box-shadow:
      0 25px 80px -15px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.04);
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
      linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
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
  .pj-arch-flow {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 12px;
    align-items: center;
  }
  @media(min-width: 768px) {
    .pj-arch-flow { flex-direction: row; gap: 0; justify-content: center; }
  }
  .pj-arch-node {
    display: flex; flex-direction: column;
    align-items: center; gap: 8px;
    padding: 20px 24px;
    border-radius: 16px;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    min-width: 130px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pj-arch-node:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(16,185,129,0.2);
  }
  .pj-arch-node-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #34d399; font-size: 18px;
  }
  .pj-arch-node-label {
    font-size: 12px; font-weight: 700; color: #fff;
    text-align: center;
  }
  .pj-arch-node-sub {
    font-size: 10px; color: rgba(52,211,153,0.45);
    text-align: center;
  }
  .pj-arch-arrow {
    display: none;
    align-items: center;
    padding: 0 8px;
    color: rgba(16,185,129,0.4);
  }
  @media(min-width: 768px) {
    .pj-arch-arrow { display: flex; }
  }

  /* ── Code block card ───────────────────────────────────── */
  .pj-code {
    background: linear-gradient(135deg, #0a2e23, #11291f);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }
  .pj-code-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px;
    background: rgba(16,185,129,0.06);
    border-bottom: 1px solid rgba(16,185,129,0.12);
  }
  .pj-code-dots {
    display: flex; gap: 6px;
  }
  .pj-code-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }
  .pj-code-file {
    font-family: 'Courier New', monospace;
    font-size: 11px; color: rgba(52,211,153,0.5);
  }
  .pj-code-body {
    padding: 20px 24px;
    font-family: 'Courier New', monospace;
    font-size: 12.5px;
    line-height: 1.8;
    color: rgba(167,243,208,0.75);
    overflow-x: auto;
  }
  .pj-code-kw { color: #34d399; font-weight: 700; }
  .pj-code-fn { color: #6ee7b7; }
  .pj-code-str { color: #a7f3d0; }
  .pj-code-cmt { color: rgba(52,211,153,0.3); font-style: italic; }
  .pj-code-ln {
    display: inline-block; width: 30px; text-align: right;
    margin-right: 16px; color: rgba(16,185,129,0.2);
    user-select: none;
  }

  /* ── Function list ─────────────────────────────────────── */
  .pj-fn {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(16,185,129,0.08);
    transition: padding-left 0.3s ease;
  }
  .pj-fn:last-child { border-bottom: none; }
  .pj-fn:hover { padding-left: 8px; }
  .pj-fn-badge {
    flex-shrink: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px; font-weight: 700;
    color: #10b981;
    background: rgba(16,185,129,0.08);
    padding: 5px 12px; border-radius: 8px;
    border: 1px solid rgba(16,185,129,0.15);
    white-space: nowrap;
    transition: background 0.2s ease;
  }
  .pj-fn:hover .pj-fn-badge {
    background: rgba(16,185,129,0.15);
  }
  .pj-fn-desc {
    font-size: 14px; color: #6b7280; line-height: 1.65;
  }
  .pj-fn-type {
    display: inline-block;
    padding: 2px 8px; border-radius: 4px; margin-left: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .pj-fn-write {
    background: rgba(251,191,36,0.1); color: #d97706;
    border: 1px solid rgba(251,191,36,0.2);
  }
  .pj-fn-read {
    background: rgba(16,185,129,0.08); color: #059669;
    border: 1px solid rgba(16,185,129,0.15);
  }
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

const FUNCTIONS = [
  { name: "createCampaign()", type: "write", desc: "Deploys a new campaign with title, description, image CID, target amount, and deadline timestamp." },
  { name: "donateToCampaign()", type: "write", desc: "Accepts ETH and forwards it directly to the campaign owner. Records the donator address and amount." },
  { name: "toggleHidden()", type: "write", desc: "Owner-only function. Toggles campaign visibility on the frontend while preserving on-chain data." },
  { name: "getCampaigns()", type: "read", desc: "Returns all campaigns as a struct array. View function — zero gas cost when called off-chain." },
  { name: "getDonators()", type: "read", desc: "Returns parallel arrays of donator addresses and their corresponding donation amounts for a campaign." },
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

        {/* ── Tech Stack ──────────────────────────────────────── */}
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

        <div className="ps-divider" />

        {/* ── Smart Contract Code Preview ─────────────────────── */}
        <div className="ps-sh">
          <div className="ps-sh-eyebrow"><span /> Contract</div>
          <h2 className="ps-sh-title">Smart Contract <em>Preview</em></h2>
          <p className="ps-sh-sub">The core CrowdFunding.sol — 120 lines of audited, gas-optimised Solidity.</p>
        </div>

        <div className="ps-grid-2" style={{ marginBottom: 64 }}>
          {/* Code preview */}
          <div
            className="pj-code"
          >
            <div className="pj-code-header">
              <div className="pj-code-dots">
                <div className="pj-code-dot" style={{ background: "#ef4444" }} />
                <div className="pj-code-dot" style={{ background: "#f59e0b" }} />
                <div className="pj-code-dot" style={{ background: "#10b981" }} />
              </div>
              <span className="pj-code-file">CrowdFunding.sol</span>
            </div>
            <div className="pj-code-body">
              <div><span className="pj-code-ln">1</span><span className="pj-code-cmt">// SPDX-License-Identifier: UNLICENSED</span></div>
              <div><span className="pj-code-ln">2</span><span className="pj-code-kw">pragma</span> solidity ^0.8.28;</div>
              <div><span className="pj-code-ln">3</span></div>
              <div><span className="pj-code-ln">4</span><span className="pj-code-kw">contract</span> <span className="pj-code-fn">CrowdFunding</span> {"{"}</div>
              <div><span className="pj-code-ln">5</span>  <span className="pj-code-kw">struct</span> <span className="pj-code-fn">Campaign</span> {"{"}</div>
              <div><span className="pj-code-ln">6</span>    address owner;</div>
              <div><span className="pj-code-ln">7</span>    string title;</div>
              <div><span className="pj-code-ln">8</span>    uint256 target;</div>
              <div><span className="pj-code-ln">9</span>    uint256 deadline;</div>
              <div><span className="pj-code-ln">10</span>    uint256 amountCollected;</div>
              <div><span className="pj-code-ln">11</span>    <span className="pj-code-kw">bool</span> isHidden;</div>
              <div><span className="pj-code-ln">12</span>  {"}"}</div>
              <div><span className="pj-code-ln">13</span></div>
              <div><span className="pj-code-ln">14</span>  <span className="pj-code-kw">function</span> <span className="pj-code-fn">donateToCampaign</span>(…)</div>
              <div><span className="pj-code-ln">15</span>    <span className="pj-code-kw">external payable</span> {"{ … }"}</div>
            </div>
          </div>

          {/* Function list */}
          <div
            className="ps-glass"
          >
            <div style={{ fontFamily: 'var(--font-bricolage, "Bricolage Grotesque"), sans-serif', fontSize: 16, fontWeight: 800, color: "#064e3b", marginBottom: 16 }}>
              Public Interface
            </div>
            {FUNCTIONS.map(({ name, type, desc }) => (
              <div key={name} className="pj-fn">
                <div className="pj-fn-badge">{name}</div>
                <div>
                  <p className="pj-fn-desc">
                    {desc}
                    <span className={`pj-fn-type ${type === "write" ? "pj-fn-write" : "pj-fn-read"}`}>
                      {type}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contract stats ──────────────────────────────────── */}
        <div className="ps-grid-4" style={{ marginBottom: 64 }}>
          {[
            { num: "120", label: "Lines of Solidity" },
            { num: "5", label: "Public Functions" },
            { num: "3", label: "Events Emitted" },
            { num: "0", label: "External Deps" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="ps-stat"
            >
              <div className="ps-stat-num">{num}</div>
              <div className="ps-stat-label">{label}</div>
            </div>
          ))}
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
          className="ps-cta"
        >
          <h2 className="ps-cta-title">View on <em>GitHub</em></h2>
          <p className="ps-cta-sub">The full source code is open-source. Star the repo, report issues, or contribute.</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ps-cta-btn">
            <span><FiExternalLink size={16} /> Source Code</span>
          </a>
        </div>
      </PageShell>
    </>
  );
};

export default Project;
