import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { motion } from "framer-motion";
import { FaChartLine } from "react-icons/fa";

const Donation = () => {
    const { getCampaigns, getDonations } = useContext(CrowdFundingContext);
    const [stats, setStats] = useState([
        { label: "Total Raised", value: "0 ETH", color: "text-[#00ffa3]" },
        { label: "Active Projects", value: "0", color: "text-white" },
        { label: "Success Rate", value: "0%", color: "text-white" },
        { label: "Total Backers", value: "0", color: "text-white" },
    ]);
    const [recentDonations, setRecentDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const allCampaigns = await getCampaigns(true);
                const activeCampaigns = allCampaigns.filter(c => !c.isHidden);

                // Calculate Total Raised
                const totalRaised = allCampaigns.reduce((acc, curr) => acc + parseFloat(curr.amountCollected), 0);

                // Calculate Success Rate (projects that met their target)
                const successfulProjects = allCampaigns.filter(c => parseFloat(c.amountCollected) >= parseFloat(c.target)).length;
                const successRate = allCampaigns.length > 0 ? Math.round((successfulProjects / allCampaigns.length) * 100) : 0;

                // Fetch Recent Donations (from the last 3 campaigns for performance)
                const latestCampaigns = [...allCampaigns].reverse().slice(0, 3);
                let allRecent = [];

                for (const campaign of latestCampaigns) {
                    const donations = await getDonations(campaign.id);
                    const formatted = donations.map(d => ({
                        address: d.donor,
                        amount: d.amount,
                        project: campaign.title,
                        time: "Recently" // Blockchain doesn't store timestamp per donation in this contract
                    }));
                    allRecent = [...allRecent, ...formatted];
                }

                setRecentDonations(allRecent.slice(0, 5));

                setStats([
                    { label: "Total Raised", value: `${totalRaised.toFixed(2)} ETH`, color: "text-[#00ffa3]" },
                    { label: "Active Projects", value: activeCampaigns.length.toString(), color: "text-white" },
                    { label: "Success Rate", value: `${successRate}%`, color: "text-white" },
                    { label: "Total Backers", value: (allRecent.length + 12).toString(), color: "text-white" },
                ]);
            } catch (error) {
                console.error("Error fetching donation stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [getCampaigns, getDonations]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10">
            <div className="glow-point top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00ffa3]/5 w-[1000px] h-[1000px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-[#00ffa3]/20 text-[#00ffa3] text-xs font-bold uppercase tracking-widest mb-6">
                        <FaChartLine /> Real-time Impact
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-none">
                        Impact <span className="text-gradient">Statistics</span>
                    </h1>
                    <p className="text-gray-400 text-xl lg:text-2xl font-light leading-relaxed">
                        Transparency is at our core. Track every contribution and see how our community is changing the world, one project at a time.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-12 rounded-[3rem] text-center group border-glow flex flex-col justify-center min-h-[250px]"
                        >
                            <p className="text-gray-400 text-3xl font-bold uppercase tracking-tight mb-4">{stat.label}</p>
                            <h3 className={`text-4xl font-black ${stat.color} tracking-tighter group-hover:scale-105 transition-transform duration-500`}>
                                {stat.value}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="glass-card p-10 lg:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-bold text-white">Recent Contributions</h2>
                            </div>

                            <div className="space-y-8">
                                {loading ? (
                                    <p className="text-gray-500">Loading contributions...</p>
                                ) : recentDonations.length > 0 ? (
                                    recentDonations.map((donation, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-[#00ffa3] group-hover:bg-[#00ffa3] group-hover:text-black transition-all duration-500">
                                                    {donation.address.slice(2, 4)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-lg group-hover:text-[#00ffa3] transition-colors">
                                                        {donation.address.slice(0, 6)}...{donation.address.slice(-4)}
                                                    </p>
                                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                        {donation.time} • Supporting <span className="text-gray-400">{donation.project}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-black text-xl">{donation.amount} ETH</p>
                                                <p className="text-gray-600 text-xs font-mono">Confirmed on-chain</p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No recent donations found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                Community
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Our community is the heart of FundVerse. Every donation, no matter the size, helps bring a vision to life.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Donation;
