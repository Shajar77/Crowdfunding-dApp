import React, { useContext, useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";

// Lazy load components to reduce initial bundle size
const Hero = lazy(() => import("../Components/Hero"));
const Card = lazy(() => import("../Components/Card"));
const PopUp = lazy(() => import("../Components/PopUp"));

// Loading fallback components
const HeroSkeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-green-50 to-emerald-100 h-screen flex items-center justify-center">
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

/* ─── Section header component ──────────────────────────────────────── */
const SectionHead = React.memo(({ eyebrow, title, subtitle }) => (
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    {eyebrow && <div className="sh-eyebrow"><span />{eyebrow}</div>}
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
  <div style={{
    gridColumn: "1 / -1", textAlign: "center",
    padding: "60px 24px",
    background: "rgba(255,255,255,0.88)",
    border: "1px dashed rgba(16,185,129,0.25)",
    borderRadius: 20,
    fontFamily: "'Inter', sans-serif",
  }}>
    <div style={{ fontSize: 36, marginBottom: 14 }}>🌿</div>
    <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500 }}>{message}</p>
  </div>
);

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

  const handleToggle = useCallback(async (id) => {
    try { await toggleCampaignVisibility(id); }
    catch (err) { console.error("❌ Failed to toggle visibility:", err); }
  }, [toggleCampaignVisibility]);

  const handleCreate = useCallback(async (formData) => {
    try { await createCampaign(formData); }
    catch (e) { console.error("❌ Create campaign error:", e); }
  }, [createCampaign]);

  const showSamples = !currentAccount;

  return (
    <>

      {/* Hero section with lazy loading */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero createCampaign={handleCreate} />
      </Suspense>

      {/* ── All / Sample Campaigns ──────────────────────────────────── */}
      <section className="pg-section" style={{ position: "relative" }}>
        <div className="pg-grid-bg" />
        <div className="pg-inner">
          <SectionHead
            eyebrow="Featured"
            title="<em>Active</em> Campaigns"
            subtitle="Discover and support innovative projects from creators worldwide."
          />

          <div className="pg-card-grid">
            {showSamples ? (
              SAMPLE_CAMPAIGNS.map((c, i) => (
                <Suspense key={c.id} fallback={<CardSkeleton />}>
                  <Card campaign={c} isSample={true} currentAccount={null} priority={i < 3} />
                </Suspense>
              ))
            ) : campaigns.length > 0 ? (
              campaigns.map((c, i) => (
                <Suspense key={c.id} fallback={<CardSkeleton />}>
                  <Card
                    campaign={c}
                    setOpenModel={setOpenModel} setDonate={setDonateCampaign}
                    onToggleHidden={handleToggle}
                    currentAccount={currentAccount}
                    priority={i < 3}
                  />
                </Suspense>
              ))
            ) : (
              <EmptyState message="No active campaigns yet. Be the first to launch one!" />
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      {currentAccount && <div className="pg-divider" />}

      {/* Your Campaigns */}
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
              {userCampaigns.length > 0 ? (
                userCampaigns.map((c, i) => (
                  <Suspense key={c.id} fallback={<CardSkeleton />}>
                    <Card
                      campaign={c}
                      setOpenModel={setOpenModel} setDonate={setDonateCampaign}
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

      {/* Donate popup with lazy loading */}
      {openModel && donateCampaign && (
        <Suspense fallback={null}>
          <PopUp setOpenModel={setOpenModel} donate={donateCampaign} donateFunction={donate} />
        </Suspense>
      )}
    </>
  );
};

export default Index;
