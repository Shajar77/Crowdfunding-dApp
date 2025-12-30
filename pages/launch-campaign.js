import React, { useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, PopUp } from "../Components";

const LaunchCampaign = () => {
    const {
        createCampaign,
        donate,
    } = useContext(CrowdFundingContext);

    const [openModel, setOpenModel] = useState(false);
    const [donateCampaign, setDonateCampaign] = useState(null);

    const handleCreateCampaign = async (formData) => {
        try {
            await createCampaign(formData);
        } catch (error) {
            console.error("❌ Error creating campaign:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <Hero titleData="Launch Your Project" createCampaign={handleCreateCampaign} />

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

export default LaunchCampaign;
