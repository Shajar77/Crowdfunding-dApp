import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Card, PopUp } from "../Components";
import { motion } from "framer-motion";

const MyCampaigns = () => {
    const {
        getUserCampaigns,
        donate,
        currentAccount,
        deleteCampaign,
        toggleCampaignVisibility,
    } = useContext(CrowdFundingContext);

    const [usercampaign, setUsercampaign] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    const [donateCampaign, setDonateCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatCampaigns = (campaigns) =>
        campaigns.map((c) => ({ ...c, id: c.id.toString() }));

    const fetchData = async () => {
        if (!currentAccount) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const userData = await getUserCampaigns();
            console.log("✅ User Campaigns:", userData);
            setUsercampaign(formatCampaigns(userData));
        } catch (error) {
            console.error("❌ Error fetching user campaigns:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentAccount]);

    const handleDelete = async (campaignId) => {
        await deleteCampaign(campaignId);
        setUsercampaign((prev) => prev.filter((c) => c.id !== campaignId.toString()));
    };

    const handleToggleVisibility = async (campaignId) => {
        await toggleCampaignVisibility(campaignId);
        await fetchData();
    };

    return (
        <div className="min-h-screen pt-32 pb-24">
            <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
                        My <span className="text-gradient">Campaigns</span>
                    </h1>
                    <p className="text-gray-400 text-lg lg:text-xl max-w-2xl font-light">
                        Manage and track the progress of the projects you've launched on the protocol.
                    </p>
                </motion.div>

                {!currentAccount ? (
                    <div className="glass p-12 rounded-[2.5rem] text-center border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
                        <p className="text-gray-400 mb-8">Please connect your wallet to view and manage your campaigns.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-12 h-12 border-4 border-[#00ffa3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {usercampaign.length > 0 ? (
                            usercampaign.map((campaign) => (
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
                            <div className="col-span-full glass p-16 rounded-[2.5rem] text-center border border-white/5">
                                <h3 className="text-2xl font-bold text-white mb-4">No Campaigns Found</h3>
                                <p className="text-gray-400 mb-8">You haven't created any campaigns yet. Ready to launch your first idea?</p>
                                <a href="/" className="inline-block px-8 py-4 bg-[#00ffa3] text-black font-bold rounded-full hover:bg-[#00e090] transition-all">
                                    Launch a Campaign
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {openModel && donateCampaign && (
                <PopUp
                    setOpenModel={setOpenModel}
                    donate={donateCampaign}
                    donateFunction={donate}
                />
            )}
        </div>
    );
};

export default MyCampaigns;
