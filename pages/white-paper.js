import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { motion } from "framer-motion";
import { FaBook, FaShieldAlt, FaRocket, FaCode, FaChartBar } from "react-icons/fa";

const WhitePaper = () => {
    const { getCampaigns } = useContext(CrowdFundingContext);
    const [protocolStats, setProtocolStats] = useState({ totalRaised: "0", totalCampaigns: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const all = await getCampaigns(true);
            const total = all.reduce((acc, curr) => acc + parseFloat(curr.amountCollected), 0);
            setProtocolStats({ totalRaised: total.toFixed(2), totalCampaigns: all.length });
        };
        fetchStats();
    }, [getCampaigns]);

    const sections = [
        {
            id: "intro",
            title: "Introduction",
            icon: <FaBook />,
            content: "FundVerse is a decentralized crowdfunding platform built on the Ethereum blockchain. Our mission is to democratize access to capital for innovators, dreamers, and builders worldwide, removing the barriers of traditional finance. We believe that great ideas shouldn't be limited by geographical or institutional boundaries."
        },
        {
            id: "tech",
            title: "Core Technology",
            icon: <FaCode />,
            content: "The platform utilizes smart contracts to ensure transparency, security, and trustless execution. Every campaign is a unique contract instance that holds funds securely until the goal is reached or the deadline passes. We leverage IPFS for decentralized storage of campaign assets, ensuring that your data remains permanent and censorship-resistant.",
            list: ["Smart Contract Security", "IPFS for Decentralized Storage", "Real-time Blockchain Indexing", "Gas-optimized Transactions"]
        },
        {
            id: "security",
            title: "Security & Trust",
            icon: <FaShieldAlt />,
            content: "Security is our top priority. Our smart contracts are designed with industry best practices, including reentrancy protection and access control. We provide a transparent environment where every transaction is verifiable on-chain, giving backers the confidence they need to support projects."
        },
        {
            id: "roadmap",
            title: "Roadmap",
            icon: <FaRocket />,
            content: "Our vision extends beyond simple crowdfunding. We are building a comprehensive ecosystem for decentralized innovation.",
            phases: [
                { title: "Phase 1", desc: "Platform Launch & Core Features", status: "Completed" },
                { title: "Phase 2", desc: "Governance Token Integration", status: "In Progress" },
                { title: "Phase 3", desc: "Cross-chain Expansion", status: "Upcoming" }
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10">
            {/* Background Glows */}
            <div className="glow-point top-20 right-20 bg-[#00ffa3]/10 w-[600px] h-[600px]"></div>
            <div className="glow-point bottom-20 left-20 bg-white/5 w-[500px] h-[500px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col lg:flex-row gap-16"
            >
                {/* Sidebar Navigation */}
                <aside className="lg:w-1/4 hidden lg:block sticky top-32 h-fit">
                    <div className="glass-card p-8 rounded-[2rem] mb-8">
                        <h3 className="text-white font-bold mb-6 text-xl">Contents</h3>
                        <nav className="space-y-4">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-gray-400 hover:text-[#00ffa3] transition-colors text-sm font-medium flex items-center gap-3 group"
                                >
                                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#00ffa3] transition-all"></span>
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border-[#00ffa3]/20 bg-[#00ffa3]/5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <FaChartBar className="text-[#00ffa3]" /> Protocol Stats
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Total Raised</p>
                                <p className="text-xl font-bold text-[#00ffa3]">{protocolStats.totalRaised} ETH</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Active Campaigns</p>
                                <p className="text-xl font-bold text-white">{protocolStats.totalCampaigns}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:w-3/4 space-y-12">
                    <header className="mb-16">
                        <div className="inline-block px-4 py-1 rounded-full glass border-[#00ffa3]/30 text-[#00ffa3] text-xs font-bold uppercase tracking-widest mb-6">
                            Documentation v1.0
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-none">
                            White <span className="text-gradient">Paper</span>
                        </h1>
                        <p className="text-gray-400 text-xl lg:text-2xl font-light max-w-3xl leading-relaxed">
                            The blueprint for a decentralized future of innovation and collective growth.
                        </p>
                    </header>

                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-10 lg:p-16 rounded-[3rem] card-shine"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-[#00ffa3]/10 flex items-center justify-center text-[#00ffa3] text-3xl">
                                    {section.icon}
                                </div>
                                <h2 className="text-4xl font-bold text-white">{section.title}</h2>
                            </div>

                            <p className="text-gray-300 text-lg lg:text-xl font-light leading-relaxed mb-8">
                                {section.content}
                            </p>

                            {section.list && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.list.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3]"></div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.phases && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                                    {section.phases.map((phase, i) => (
                                        <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#00ffa3]/20 transition-all group">
                                            <div className="text-[#00ffa3] font-bold text-sm mb-2 uppercase tracking-widest">{phase.title}</div>
                                            <h4 className="text-white font-bold mb-3 group-hover:text-[#00ffa3] transition-colors">{phase.desc}</h4>
                                            <div className="text-xs text-gray-500 font-mono">{phase.status}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    ))}

                    <footer className="pt-20 text-center">
                        <p className="text-gray-500 text-sm">
                            Last Updated: December 2025 • FundVerse Protocol
                        </p>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
};

export default WhitePaper;
