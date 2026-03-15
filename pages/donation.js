import React, { useContext, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import PageShell from "../Components/PageShell";
import { Card, PopUp } from "../Components";
import {
  FiSearch, FiFilter, FiGrid, FiList,
  FiArrowUpRight, FiHeart
} from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";

/* ── Samples ─────────────────────────────────────────────────────── */
const SAMPLE_CAMPAIGNS = [
  { id: "s1", title: "EcoChain: Reforestation on Blockchain", description: "Planting 1M trees with every sapling tracked on-chain via NFT proof-of-contribution.", target: "50", amountCollected: "32.4", deadline: "14d 6h", owner: "0xA1b2...C3d4", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", category: "Environment", isSample: true },
  { id: "s2", title: "OpenMed: AI Diagnostics for Clinics", description: "Deploying AI diagnostic tools to 200 rural clinics running fully offline on edge hardware.", target: "80", amountCollected: "61.7", deadline: "7d 12h", owner: "0xF4e5...A6b7", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", category: "Health", isSample: true },
  { id: "s3", title: "ZeroWave: Decentralised Clean Energy", description: "Building a peer-to-peer solar marketplace for urban rooftops. Cutting grid dependency by 60%.", target: "120", amountCollected: "47.9", deadline: "21d 3h", owner: "0xC8d9...E0f1", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80", category: "Energy", isSample: true },
  { id: "s4", title: "EduNodes: Mesh Network for Schools", description: "A decentralised mesh net providing free educational content to remote schools globally.", target: "40", amountCollected: "12.5", deadline: "30d 12h", owner: "0xD2e3...B4a5", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", category: "Education", isSample: true },
  { id: "s5", title: "AquaFlow: IoT Water Management", description: "Smart water sensors detecting leakages and monitoring quality. Reducing waste by 40%.", target: "65", amountCollected: "54.2", deadline: "12d 8h", owner: "0xB9c8...E7d3", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80", category: "Technology", isSample: true },
  { id: "s6", title: "ShelterLink: Rapid Housing for Refugees", description: "3D printing modular shelters deployed in under 24 hours for displaced families.", target: "150", amountCollected: "98.3", deadline: "5d 14h", owner: "0xG5f6...H9i0", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80", category: "Humanitarian", isSample: true },
];

const CATEGORIES = ["All", "Environment", "Health", "Energy", "Education", "Technology", "Humanitarian"];

/* ── Styles ──────────────────────────────────────────────────────── */
const donStyles = `
  /* ── Controls bar ──────────────────────────────────────── */
  .dn-controls {
    display: flex; flex-direction: column; gap: 14px;
    margin-bottom: 32px;
  }
  @media(min-width: 768px) {
    .dn-controls { flex-direction: row; align-items: center; }
  }
  .dn-search-wrap {
    flex: 1; position: relative; display: flex; align-items: center;
  }
  .dn-search-icon {
    position: absolute; left: 18px;
    color: #9ca3af; font-size: 15px; pointer-events: none;
  }
  .dn-search-input {
    width: 100%; padding: 14px 18px 14px 48px;
    border-radius: 16px;
    border: 1.5px solid rgba(16,185,129,0.18);
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    font-size: 14px; color: #064e3b;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    box-shadow: 0 2px 8px rgba(6,78,59,0.04);
  }
  .dn-search-input::placeholder { color: #aab8b2; }
  .dn-search-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.08), 0 4px 12px rgba(6,78,59,0.06);
  }

  /* ── Category pills ────────────────────────────────────── */
  .dn-cats {
    display: flex; gap: 6px; overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }
  .dn-cats::-webkit-scrollbar { display: none; }
  .dn-cat {
    padding: 8px 18px; border-radius: 999px;
    font-size: 12px; font-weight: 600;
    color: #6b7280; white-space: nowrap;
    background: rgba(255,255,255,0.7);
    border: 1.5px solid rgba(16,185,129,0.12);
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }
  .dn-cat:hover {
    border-color: rgba(16,185,129,0.3);
    color: #065f46;
    background: rgba(16,185,129,0.05);
  }
  .dn-cat.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 12px rgba(16,185,129,0.25);
  }

  /* ── Connected banner ──────────────────────────────────── */
  .dn-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 22px; border-radius: 18px;
    margin-bottom: 28px;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(16,185,129,0.2);
    box-shadow: 0 4px 16px rgba(6,78,59,0.04);
    backdrop-filter: blur(12px);
  }
  .dn-banner-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
    background: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15), 0 0 12px rgba(16,185,129,0.4);
    animation: dnPulse 2.5s ease-in-out infinite;
  }
  @keyframes dnPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.15), 0 0 12px rgba(16,185,129,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.08), 0 0 20px rgba(16,185,129,0.2); }
  }
  .dn-banner-text { font-size: 14px; font-weight: 500; color: #065f46; }
  .dn-banner-text strong { font-weight: 700; color: #064e3b; }

  /* ── Empty state ───────────────────────────────────────── */
  .dn-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 72px 32px;
    background: rgba(255,255,255,0.6);
    border: 1.5px dashed rgba(16,185,129,0.25);
    border-radius: 24px;
    backdrop-filter: blur(10px);
  }
  .dn-empty-emoji { font-size: 48px; margin-bottom: 16px; }
  .dn-empty-text { color: #6b7280; font-size: 16px; font-weight: 500; }
  .dn-empty-sub { color: #9ca3af; font-size: 13px; margin-top: 6px; }

  /* ── Result count ──────────────────────────────────────── */
  .dn-count {
    font-size: 12px; font-weight: 600; color: #9ca3af;
    letter-spacing: 0.04em;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 6px;
  }
  .dn-count strong { color: #065f46; }
`;

const Donation = () => {
  const {
    campaigns, currentAccount, donate,
    connectWallet, toggleCampaignVisibility,
  } = useContext(CrowdFundingContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);

  const isConnected = !!currentAccount;

  const displayCampaigns = useMemo(() => {
    const source = isConnected ? campaigns : SAMPLE_CAMPAIGNS;
    let filtered = source;
    if (category !== "All") {
      filtered = filtered.filter(c => c.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [campaigns, isConnected, search, category]);

  const handleToggle = useCallback(async (id) => {
    try { await toggleCampaignVisibility(id); } catch (e) { console.error(e); }
  }, [toggleCampaignVisibility]);

  return (
    <>
      <Head>
        <title>Donate — Fundverse</title>
        <meta name="description" content="Browse and donate to crowdfunding campaigns on Fundverse." />
      </Head>
      <style>{donStyles}</style>

      <PageShell
        eyebrow="Contribute"
        title="Back a <em>Campaign</em>"
        subtitle="Explore projects you believe in and support them directly on-chain. Every donation goes straight to the creator — zero fees, instant delivery."
      >
        {/* ── Stats bar ───────────────────────────────────────── */}
        <div className="ps-grid-4" style={{ marginBottom: 40 }}>
          {[
            { num: isConnected ? campaigns.length.toString() : "6", label: "Campaigns" },
            { num: "0%", label: "Platform Fee" },
            { num: "Instant", label: "Fund Transfer" },
            { num: "100%", label: "On-Chain" },
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

        {/* ── Controls ────────────────────────────────────────── */}
        <div
          className="dn-controls"
        >
          <div className="dn-search-wrap">
            <FiSearch className="dn-search-icon" />
            <input
              className="dn-search-input"
              type="text"
              placeholder="Search campaigns by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Category pills ──────────────────────────────────── */}
        <div
          className="dn-cats"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`dn-cat ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Status banner ───────────────────────────────────── */}
        {!isConnected && (
          <div
            className="dn-banner"
            style={{ marginTop: 24 }}
          >
            <span className="dn-banner-dot" />
            <span className="dn-banner-text">
              <strong>Sample campaigns</strong> — Connect your wallet to view live on-chain campaigns and donate.
            </span>
          </div>
        )}

        {/* ── Result count ────────────────────────────────────── */}
        <div className="dn-count" style={{ marginTop: isConnected ? 24 : 0 }}>
          <FiGrid size={12} />
          Showing <strong>{displayCampaigns.length}</strong> campaign{displayCampaigns.length !== 1 ? "s" : ""}
          {category !== "All" && <> in <strong>{category}</strong></>}
        </div>

        {/* ── Campaign Grid ───────────────────────────────────── */}
        <div className="ps-grid-3">
          {displayCampaigns.length > 0 ? (
            displayCampaigns.map((c) => (
              <Card
                key={c.id}
                campaign={c}
                isSample={!isConnected}
                currentAccount={currentAccount}
                setOpenModel={isConnected ? setOpenModel : undefined}
                setDonate={isConnected ? setDonateCampaign : undefined}
                onToggleHidden={handleToggle}
              />
            ))
          ) : (
            <div
              className="dn-empty"
            >
              <div className="dn-empty-emoji">🔍</div>
              <p className="dn-empty-text">No campaigns found</p>
              <p className="dn-empty-sub">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        {!isConnected && (
          <div
            className="ps-cta"
          >
            <h2 className="ps-cta-title">Ready to <em>Donate?</em></h2>
            <p className="ps-cta-sub">Connect your wallet to see live campaigns and start backing projects you believe in.</p>
            <button className="ps-cta-btn" onClick={connectWallet}>
              <span><FaEthereum /> Connect Wallet</span>
            </button>
          </div>
        )}
      </PageShell>

      {/* ── Donation popup ─────────────────────────────────── */}
      {openModel && donateCampaign && (
        <PopUp
          setOpenModel={setOpenModel}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Donation;
