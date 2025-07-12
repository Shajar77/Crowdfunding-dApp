import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, PopUp } from "../Components";

const Index = () => {
  const {
    getCampaigns,
    getUserCampaigns,
    createCampaign,
    donate,
    currentAccount,
    deleteCampaign,
    toggleCampaignVisibility,
  } = useContext(CrowdFundingContext);

  const [allcampaign, setAllcampaign] = useState([]);
  const [usercampaign, setUsercampaign] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);

  const formatCampaigns = (campaigns) =>
    campaigns.map((c) => ({ ...c, id: c.id.toString() }));

  const fetchData = async () => {
    if (!currentAccount) return;

    try {
      const allData = await getCampaigns(true); // get all campaigns including hidden
      const userData = await getUserCampaigns();

      console.log("✅ All Campaigns:", allData);
      console.log("✅ User Campaigns:", userData);

      setAllcampaign(formatCampaigns(allData));
      setUsercampaign(formatCampaigns(userData));
    } catch (error) {
      console.error("❌ Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentAccount]); // Fetch data only after wallet connects

  const handleDelete = async (campaignId) => {
    await deleteCampaign(campaignId);
    setAllcampaign((prev) => prev.filter((c) => c.id !== campaignId.toString()));
    setUsercampaign((prev) => prev.filter((c) => c.id !== campaignId.toString()));
  };

  const handleToggleVisibility = async (campaignId) => {
    await toggleCampaignVisibility(campaignId);
    await fetchData(); // Refresh campaigns after toggling visibility
  };

  const handleCreateCampaign = async (formData) => {
    try {
      await createCampaign(formData);
      await fetchData(); // Refresh after creating
    } catch (error) {
      console.error("❌ Error creating campaign:", error);
    }
  };

  // Filter out hidden campaigns on UI based on the on-chain isHidden flag
  const filteredAll = allcampaign.filter((c) => !c.isHidden);
  const filteredUser = usercampaign.filter((c) => !c.isHidden);

  return (
    <>
      <Hero titleData="Support Projects You Love" createCampaign={handleCreateCampaign} />

      {/* All Campaigns */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold mb-4">All Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAll.length > 0 ? (
            filteredAll.map((campaign) => (
              <Card
                key={campaign.id}
                campaign={campaign}
                setOpenModel={setOpenModel}
                setDonate={setDonateCampaign}
                onDelete={handleDelete}
                onToggleHidden={handleToggleVisibility}
                currentAccount={currentAccount}
                isHidden={campaign.isHidden}
              />
            ))
          ) : (
            <p className="text-gray-600">No campaigns found.</p>
          )}
        </div>
      </section>

      {/* User Campaigns */}
      <section className="px-6 py-10 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUser.length > 0 ? (
            filteredUser.map((campaign) => (
              <Card
                key={campaign.id}
                campaign={campaign}
                setOpenModel={setOpenModel}
                setDonate={setDonateCampaign}
                onDelete={handleDelete}
                onToggleHidden={handleToggleVisibility}
                currentAccount={currentAccount}
                isHidden={campaign.isHidden}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven't created any campaigns yet.</p>
          )}
        </div>
      </section>

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

export default Index;
