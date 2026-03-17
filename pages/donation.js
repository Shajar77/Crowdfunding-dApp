import React, { useContext, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import PageShell from "../Components/PageShell";
import { Card, PopUp } from "../Components";
import {
  FiSearch, FiGrid
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
  /* ── Overrides ────────────────────────────────────────── */
  .ps-inner { padding-top: 60px !important; }
  @media(min-width: 768px) { .ps-inner { padding-top: 80px !important; } }


  /* ── Controls bar — Now below form ─────────────────────── */
  .dn-controls { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
  @media(min-width: 768px) { .dn-controls { flex-direction: row; align-items: center; } }
  .dn-search-wrap { flex: 1; position: relative; display: flex; align-items: center; width: 100%; }
  .dn-search-icon { position: absolute; left: 18px; color: #9ca3af; font-size: 16px; pointer-events: none; }
  .dn-search-input {
    width: 100%; padding: 14px 20px 14px 52px; border-radius: 16px;
    border: 1.5px solid rgba(16,185,129,0.18); background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px); font-size: 14.5px; color: #064e3b; outline: none;
    transition: all 0.2s ease;
  }
  .dn-search-input:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }

  /* ── Category pills ────────────────────────────────────── */
  .dn-cats { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
  .dn-cat {
    padding: 7px 16px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
    color: #6b7280; background: rgba(255,255,255,0.7); border: 1.5px solid rgba(16,185,129,0.12);
    cursor: pointer; transition: all 0.2s ease;
  }
  .dn-cat.active { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border-color: transparent; }

  /* ── Result count ──────────────────────────────────────── */
  .dn-count { font-size: 13px; font-weight: 600; color: #9ca3af; margin-bottom: 24px; display: flex; align-items: center; gap: 6px; }
  .dn-count strong { color: #065f46; }

  /* ── Section Title ────────────────────────────────────── */
  .dn-section-title {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: clamp(2rem, 4vw, 2.6rem); font-weight: 800; color: #042f2e;
    margin: 64px 0 24px; letter-spacing: -0.03em; line-height: 1.1;
  }
  .dn-section-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── Status Banner ─────────────────────────────────────── */
  .dn-banner {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .dn-banner-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.5);
  }
  .dn-banner-text {
    font-size: 13.5px; font-weight: 500; color: #064e3b; line-height: 1.5;
  }
  .dn-banner-text strong { color: #064e3b; font-weight: 700; }

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
    const source = [...campaigns, ...SAMPLE_CAMPAIGNS];
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
  }, [campaigns, search, category]);

  const handleToggle = useCallback(async (id) => {
    try { await toggleCampaignVisibility(id); } catch (e) { /* Error toggling visibility */ }
  }, [toggleCampaignVisibility]);

  return (
    <>
      <Head>
        <title>Campaigns — Fundverse</title>
        <meta name="description" content="Browse, back, and launch crowdfunding campaigns on Fundverse." />
      </Head>
      <style>{donStyles}</style>

      <PageShell>

        {/* ── Active Campaigns Section ── */}
        <h2 className="dn-section-title">
          Active <em>Campaigns</em>
        </h2>

        <div className="dn-controls">
          <div className="dn-search-wrap">
            <FiSearch className="dn-search-icon" />
            <input
              type="text"
              className="dn-search-input"
              placeholder="Search through all campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="dn-cats">
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
          <div className="dn-banner" style={{ margin: "24px 0" }}>
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
          {category !== "All" && <>in <strong>{category}</strong></>}
        </div>

        {/* ── Campaign Grid ───────────────────────────────────── */}
        <div className="ps-grid-3">
          {displayCampaigns.length > 0 ? (
            displayCampaigns.map((c) => (
              <Card
                key={c.id}
                campaign={c}
                isSample={c.isSample}
                currentAccount={currentAccount}
                setOpenModel={!c.isSample && isConnected ? setOpenModel : undefined}
                setDonate={!c.isSample && isConnected ? setDonateCampaign : undefined}
                onToggleHidden={handleToggle}
              />
            ))
          ) : (
            <div className="dn-empty">
              <div className="dn-empty-emoji">🔍</div>
              <p className="dn-empty-text">No campaigns found</p>
              <p className="dn-empty-sub">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        {/* ── CTA for non-connected users ─────────────────────── */}
        {!isConnected && (
          <div className="ps-cta" style={{ marginTop: 64 }}>
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
