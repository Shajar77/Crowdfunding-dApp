import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Card, PopUp } from "../Components";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaRocket, FaFire, FaClock } from "react-icons/fa";

const Projects = () => {
    const { getCampaigns, currentAccount, donate } = useContext(CrowdFundingContext);
    const [allcampaign, setAllcampaign] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [openModel, setOpenModel] = useState(false);
    const [donateCampaign, setDonateCampaign] = useState(null);

    const formatCampaigns = (campaigns) =>
        campaigns.map((c) => ({ ...c, id: c.id.toString() }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allData = await getCampaigns();
                const formatted = formatCampaigns(allData);
                setAllcampaign(formatted);
                setFilteredCampaigns(formatted.filter((c) => !c.isHidden));
            } catch (error) {
                console.error("❌ Error fetching projects:", error);
            }
        };
        fetchData();
    }, [getCampaigns]);

    useEffect(() => {
        let result = allcampaign.filter((c) => !c.isHidden);

        if (searchTerm) {
            result = result.filter((c) =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeFilter === "trending") {
            result = [...result].sort((a, b) => b.amountCollected - a.amountCollected);
        } else if (activeFilter === "newest") {
            result = [...result].sort((a, b) => b.deadline - a.deadline);
        }

        setFilteredCampaigns(result);
    }, [searchTerm, activeFilter, allcampaign]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10">
            {/* Background Glows */}
            <div className="glow-point top-0 left-1/4 bg-[#00ffa3]/10 w-[800px] h-[800px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-[#00ffa3]/20 text-[#00ffa3] text-xs font-bold uppercase tracking-widest mb-6">
                            <FaRocket className="animate-bounce" /> Discover Innovation
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 leading-none">
                            Explore <span className="text-gradient">Projects</span>
                        </h1>
                        <p className="text-gray-400 text-xl lg:text-2xl font-light leading-relaxed">
                            Join the decentralized revolution. Support the builders of tomorrow and earn rewards for your contributions.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group flex-grow lg:w-80">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ffa3] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#00ffa3]/50 focus:bg-white/10 transition-all text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    {[
                        { id: "all", label: "All Projects", icon: <FaFilter /> },
                        { id: "trending", label: "Trending", icon: <FaFire /> },
                        { id: "newest", label: "Newest", icon: <FaClock /> },
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-medium text-sm ${activeFilter === filter.id
                                ? "bg-[#00ffa3] border-[#00ffa3] text-black shadow-lg shadow-[#00ffa3]/20"
                                : "glass border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {filter.icon}
                            {filter.label}
                        </button>
                    ))}
                    <div className="ml-auto text-gray-500 text-sm font-mono">
                        Showing {filteredCampaigns.length} results
                    </div>
                </div>

                {/* Projects Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                    >
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign, i) => (
                                <motion.div
                                    key={campaign.id || i}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Card
                                        campaign={campaign}
                                        setOpenModel={setOpenModel}
                                        setDonate={setDonateCampaign}
                                        currentAccount={currentAccount}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-32 text-center glass-card rounded-[3rem] border border-white/5"
                            >
                                <div className="text-6xl mb-6 opacity-20">🔍</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
                                <p className="text-gray-500 font-light">Try adjusting your search or filters to find what you're looking for.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

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

export default Projects;
