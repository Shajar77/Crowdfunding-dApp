import React, { useContext, useState, useEffect } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaSun, FaMoon } from "react-icons/fa";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import Particles from "react-tsparticles";
import axios from "axios";

const Hero = ({ createCampaign }) => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);

  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    image: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!campaign.title) newErrors.title = "Title is required";
    if (!campaign.description) newErrors.description = "Description is required";
    if (!campaign.amount || isNaN(campaign.amount)) newErrors.amount = "Valid amount required";
    if (!campaign.deadline) newErrors.deadline = "Deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampaign({ ...campaign, image: file });
    }
  };

  const runConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        },
      });
      toast.success("Image uploaded to IPFS successfully!");
      return response.data.IpfsHash;
    } catch (err) {
      toast.error("Error uploading image to IPFS.");
      console.error("Pinata upload error:", err);
    }
  };

  const createNewCampaign = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let imageCid = null;
      if (campaign.image) {
        imageCid = await uploadToPinata(campaign.image);
      }

      await createCampaign({ ...campaign, imageCid });

      toast.success("Campaign launched successfully!");
      runConfetti();
      setCampaign({ title: "", description: "", amount: "", deadline: "", image: null });
    } catch (err) {
      toast.error("Failed to launch campaign.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const ethToUsdRate = 3200;
  const usdAmount = ((parseFloat(campaign.amount) || 0) * ethToUsdRate).toFixed(2);

  return (
    <div className={`${theme === "dark" ? "dark" : ""} font-epilogue`}>
      <section className="relative min-h-screen bg-black dark:bg-black text-white px-6 py-20 flex items-center justify-center overflow-hidden transition-colors duration-500">
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0"
          options={{
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 50 },
              color: { value: "#00ffcc" },
              shape: { type: "circle" },
              opacity: { value: 0.3 },
              size: { value: { min: 1, max: 4 } },
              links: { enable: true, distance: 150, color: "#00ffcc" },
              move: { enable: true, speed: 1 },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
            },
          }}
        />

        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-10 text-xl p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 h-1 bg-green-400 z-50"
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                FundVerse
              </span>
              <br />
              Dream. Fund. Build.
            </h1>
            <p className="text-gray-300 text-lg max-w-md mx-auto md:mx-0">
              Launch your project, get funded, and shape the future through decentralized crowdfunding.
            </p>

            <div className="mt-8 flex flex-col gap-4 items-center md:items-start">
              {!currentAccount ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <FaWallet className="text-xl" /> Connect Wallet
                </motion.button>
              ) : (
                <div className="inline-block bg-gray-800 border border-gray-700 px-5 py-2 rounded-lg text-green-400 font-mono text-sm">
                  ✅ {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </div>
              )}
              {/* Etherscan Button */}
              {currentAccount && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://etherscan.io/address/${currentAccount}`}
                  target="_blank"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <FaWallet className="text-xl" /> View on Etherscan
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full max-w-xl bg-white/5 dark:bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-xl backdrop-blur-lg"
          >
            <h2 className="text-xl font-semibold text-green-400 mb-6 text-center">
              Create New Campaign
            </h2>
            <form onSubmit={createNewCampaign} className="space-y-5 font-epilogue">
              {["title", "description", "amount", "deadline"].map((field) => (
                <motion.div
                  key={field}
                  animate={errors[field] ? { x: [-10, 10, -6, 6, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {field === "description" ? (
                    <textarea
                      name="description"
                      value={campaign.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="w-full px-4 py-3 bg-transparent text-white border border-gray-600 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ) : (
                    <input
                      type={field === "deadline" ? "date" : field === "amount" ? "number" : "text"}
                      name={field}
                      value={campaign[field]}
                      onChange={handleChange}
                      placeholder={field === "amount" ? "Amount in ETH" : field.charAt(0).toUpperCase() + field.slice(1)}
                      step={field === "amount" ? "0.01" : undefined}
                      className="w-full px-4 py-3 bg-transparent text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  )}
                  {field === "amount" && campaign.amount && (
                    <p className="text-sm text-gray-400 mt-1">~ ${usdAmount} USD</p>
                  )}
                  {errors[field] && (
                    <span className="text-red-500 text-sm mt-1 block">{errors[field]}</span>
                  )}
                </motion.div>
              ))}

              <div>
                <label className="text-sm text-gray-400">Campaign Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-transparent text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mt-3"
                />
                {campaign.image && <p className="text-sm text-gray-400 mt-1">Image selected for upload.</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg focus:outline-none"
              >
                {isLoading ? "Creating..." : "Launch Campaign"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
