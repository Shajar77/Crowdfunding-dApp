import React, { useEffect, useContext, useState, useMemo } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, PopUp } from "../Components";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Sample campaigns shown before wallet is connected ─────────────── */
const SAMPLE_CAMPAIGNS = [
  {
    id: "sample-1",
    title: "EcoChain: Reforestation on Blockchain",
    description:
      "We're planting 1 million trees across deforested regions of South Asia, with every sapling tracked on-chain for full transparency. Each donor receives an NFT proof of their contribution.",
    target: "50",
    amountCollected: "32.4",
    deadline: "14d 6h 22m",
    owner: "0xA1b2...C3d4",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    category: "Environment",
    isSample: true,
  },
  {
    id: "sample-2",
    title: "OpenMed: Free AI Diagnostics for Rural Communities",
    description:
      "Deploying AI-powered diagnostic tools to 200 rural clinics in Pakistan and Bangladesh. No internet required — models run fully offline on edge hardware.",
    target: "80",
    amountCollected: "61.7",
    deadline: "7d 12h 0m",
    owner: "0xF4e5...A6b7",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    category: "Health",
    isSample: true,
  },
  {
    id: "sample-3",
    title: "ZeroWave: Decentralised Clean Energy Grid",
    description:
      "Building a peer-to-peer solar energy marketplace for urban rooftops. Excess energy is tokenised and traded between neighbours, cutting grid dependency by 60%.",
    target: "120",
    amountCollected: "47.9",
    deadline: "21d 3h 40m",
    owner: "0xC8d9...E0f1",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    category: "Energy",
    isSample: true,
  },
  {
    id: "sample-4",
    title: "EduNodes: Global Mesh Network for Schools",
    description:
      "Building a decentralized mesh net to provide free, censorship-resistant educational content to remote schools. Powered by solar nodes and community-run servers.",
    target: "40",
    amountCollected: "12.5",
    deadline: "30d 12h 15m",
    owner: "0xD2e3...B4a5",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    category: "Education",
    isSample: true,
  },
  {
    id: "sample-5",
    title: "AquaFlow: IoT Water Management Systems",
    description:
      "Developing low-cost, smart water sensors to detect leakages and monitor water quality in real-time. Aiming to reduce water waste by 40% in drought-prone cities.",
    target: "65",
    amountCollected: "54.2",
    deadline: "12d 8h 45m",
    owner: "0xB9c8...E7d3",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    category: "Technology",
    isSample: true,
  },
  {
    id: "sample-6",
    title: "ShelterLink: Rapid Housing for Refugees",
    description:
      "Designing and 3D printing modular, reusable shelters that can be deployed in under 24 hours. Providing dignity and safety to displaced families globally.",
    target: "150",
    amountCollected: "98.3",
    deadline: "5d 14h 20m",
    owner: "0xG5f6...H9i0",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    category: "Humanitarian",
    isSample: true,
  },
];

const sectionHeadStyles = `
      .sh-eyebrow {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 16px 6px 8px; border-radius: 999px; margin-bottom: 18px;
        background: rgba(16,185,129,0.07);
        border: 1px solid rgba(16,185,129,0.20);
        font-family: 'Inter', sans-serif;
        font-size: 11px; font-weight: 700; letter-spacing: 0.09em;
        text-transform: uppercase; color: #047857;
      }
      .sh-eyebrow span {
        width: 6px; height: 6px; border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px rgba(16,185,129,0.8);
        display: inline-block; flex-shrink: 0;
      }
      .sh-title {
        font-family: 'Bricolage Grotesque','Inter',sans-serif;
        font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800;
        letter-spacing: -0.04em; line-height: 1.1;
        color: #064e3b; margin-bottom: 14px;
      }
      .sh-title em {
        font-style: normal;
        background: linear-gradient(110deg, #10b981 0%, #059669 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .sh-sub {
        font-family: 'Inter', sans-serif;
        font-size: 15px; color: #6b7280; font-weight: 400;
        max-width: 480px; margin: 0 auto; line-height: 1.65;
      }
`;

/* ─── Section header component ──────────────────────────────────────── */
const SectionHead = React.memo(({ eyebrow, title, subtitle }) => (
  <motion.div
    style={{ textAlign: "center", marginBottom: 48 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <style>{sectionHeadStyles}</style>
    {eyebrow && <div className="sh-eyebrow"><span />{eyebrow}</div>}
    <h2 className="sh-title" dangerouslySetInnerHTML={{ __html: title }} />
    <p className="sh-sub">{subtitle}</p>
  </motion.div>
));

/* ─── Empty state ───────────────────────────────────────────────────── */
const EmptyState = ({ message }) => (
  <div style={{
    gridColumn: "1 / -1", textAlign: "center",
    padding: "60px 24px",
    background: "rgba(255,255,255,0.6)",
    border: "1px dashed rgba(16,185,129,0.25)",
    borderRadius: 20,
    backdropFilter: "blur(8px)",
    fontFamily: "'Inter', sans-serif",
  }}>
    <div style={{ fontSize: 36, marginBottom: 14 }}>🌿</div>
    <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500 }}>{message}</p>
  </div>
);

/* ── shared card grid styles injected once ── */
const gridStyles = `
  .pg-section {
    position: relative;
    padding: 80px 32px;
    font-family: 'Inter', sans-serif;
  }
  .pg-section-alt {
    background: linear-gradient(180deg, rgba(240,253,244,0.6) 0%, rgba(255,255,255,0.4) 100%);
  }
  .pg-inner { max-width: 1280px; margin: 0 auto; }

  /* Grid line overlay */
  .pg-grid-bg {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 100% 80% at 50% 50%, #000 0%, transparent 100%);
  }

  .pg-card-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
  }
  @media(min-width:640px)  { .pg-card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(min-width:1024px) { .pg-card-grid { grid-template-columns: repeat(3, 1fr); } }

  /* Sample banner */
  .pg-sample-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px; border-radius: 14px; margin-bottom: 36px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(16,185,129,0.20);
    box-shadow: 0 2px 12px rgba(6,78,59,0.05);
    backdrop-filter: blur(10px);
    font-size: 13.5px; font-weight: 500; color: #065f46;
  }
  .pg-sample-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.8);
  }
  .pg-sample-banner strong { font-weight: 700; color: #064e3b; }

  /* Section divider */
  .pg-divider {
    height: 1px; margin: 0 auto 64px;
    max-width: 1280px;
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent);
  }
`;

/* ═══════════════════════════════════════════════════════════════════════ */
const Index = () => {
  const {
    campaigns, getCampaigns, createCampaign,
    donate, currentAccount, toggleCampaignVisibility,
  } = useContext(CrowdFundingContext);

  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);

  const userCampaigns = useMemo(() => {
    if (!currentAccount) return [];
    return campaigns.filter(c => c.owner.toLowerCase() === currentAccount.toLowerCase());
  }, [campaigns, currentAccount]);

  const handleToggle = async (id) => {
    try {
      await toggleCampaignVisibility(id);
    } catch (err) {
      console.error("❌ Failed to toggle visibility:", err);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await createCampaign(formData);
    } catch (e) {
      console.error("❌ Create campaign error:", e);
    }
  };

  const showSamples = !currentAccount;

  return (
    <>
      <style>{gridStyles}</style>

      {/* Hero */}
      <Hero titleData="Support Projects You Love" createCampaign={handleCreate} />

      {/* ── All / Sample Campaigns ──────────────────────────────────── */}
      <section className="pg-section" style={{ position: "relative" }}>
        <div className="pg-grid-bg" />
        <div className="pg-inner" style={{ position: "relative", zIndex: 1 }}>
          <SectionHead
            title={showSamples ? "Discover <em>Trending</em> Campaigns" : "All <em>Active</em> Campaigns"}
            subtitle={
              showSamples
                ? "Connect your wallet to see live campaigns and start backing ideas that matter."
                : "Live campaigns raising funds on-chain right now."
            }
          />

          {/* Sample wallet-connect notice */}
          <AnimatePresence>
            {showSamples && (
              <motion.div
                className="pg-sample-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="pg-sample-dot" />
                <span>
                  <strong>Sample campaigns</strong> — Connect your wallet above to view live on-chain campaigns and donate.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pg-card-grid">
            <AnimatePresence mode="popLayout">
              {showSamples ? (
                SAMPLE_CAMPAIGNS.map((c) => (
                  <Card key={c.id} campaign={c} isSample={true} currentAccount={null} />
                ))
              ) : campaigns.length > 0 ? (
                campaigns.map((c) => (
                  <Card
                    key={c.id} campaign={c}
                    setOpenModel={setOpenModel} setDonate={setDonateCampaign}
                    onToggleHidden={handleToggle}
                    currentAccount={currentAccount}
                  />
                ))
              ) : (
                <EmptyState message="No active campaigns yet. Be the first to launch one!" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      {currentAccount && <div className="pg-divider" />}

      {/* ── Your Campaigns ───────────────────────────────────────────── */}
      {currentAccount && (
        <section className="pg-section pg-section-alt" style={{ position: "relative" }}>
          <div className="pg-grid-bg" />
          <div className="pg-inner" style={{ position: "relative", zIndex: 1 }}>
            <SectionHead
              eyebrow="Your Portfolio"
              title="Your <em>Campaigns</em>"
              subtitle="Campaigns you've created — manage, track donations, and toggle visibility."
            />
            <div className="pg-card-grid">
              <AnimatePresence mode="popLayout">
                {userCampaigns.length > 0 ? (
                  userCampaigns.map((c) => (
                    <Card
                      key={c.id} campaign={c}
                      setOpenModel={setOpenModel} setDonate={setDonateCampaign}
                      onToggleHidden={handleToggle}
                      currentAccount={currentAccount}
                    />
                  ))
                ) : (
                  <EmptyState message="You haven't created any campaigns yet. Launch your first one above!" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Donate popup */}
      {openModel && donateCampaign && (
        <PopUp setOpenModel={setOpenModel} donate={donateCampaign} donateFunction={donate} />
      )}
    </>
  );
};

export default Index;
