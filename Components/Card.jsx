import React, { useState, useEffect } from "react";
import { FaEthereum, FaRegMoon, FaSun } from "react-icons/fa";
import { FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const Card = ({
  campaign,
  setOpenModel,
  setDonate,
  onDelete,
  onToggleHidden,
  isHidden,
  currentAccount,
}) => {
  if (!campaign) return null;

  const {
    title,
    description,
    target,
    deadline,
    amountCollected,
    owner,
    id,
    image,
  } = campaign;

  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [localImage, setLocalImage] = useState(null);

  const isOwner = currentAccount?.toLowerCase() === owner?.toLowerCase();

  useEffect(() => {
    const updateCountdown = () => {
      const timeLeft = Number(deadline) * 1000 - Date.now();
      if (timeLeft <= 0) {
        setRemainingTime("Expired");
        return;
      }
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      setRemainingTime(`${days}d ${hours}h ${minutes}m`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  useEffect(() => {
    const savedImage = localStorage.getItem(`campaignImage-${id}`);
    if (savedImage) {
      setLocalImage(savedImage);
    }
  }, [id]);

  const progress = Math.min((Number(amountCollected) / Number(target)) * 100, 100).toFixed(1);

  const handleDelete = () => {
    onDelete(id);
  };

  const handleHide = () => {
    onToggleHidden(id);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalImage(imageUrl);
      localStorage.setItem(`campaignImage-${id}`, imageUrl);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`relative group w-full max-w-md p-6 rounded-3xl shadow-2xl border-2 backdrop-blur-lg transition-all duration-300
        ${darkMode ? "bg-gray-900/80 text-white border-gray-700" : "bg-white/70 text-gray-900 border-gray-300"}`}
    >
      {showConfetti && <Confetti numberOfPieces={100} recycle={false} />}

      {isOwner && (
        <>
          <div className="absolute top-3 left-3 group">
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out
                w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600
                text-white text-xs font-bold shadow-lg"
              title="Delete Campaign"
            >
              ✕
            </button>
          </div>

          <div className="absolute top-3 left-12 group">
            <button
              onClick={handleHide}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out
                w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600
                text-white shadow-lg"
              title="Hide Campaign Permanently"
            >
              <FiEyeOff className="text-lg" />
            </button>
          </div>
        </>
      )}

      <div className="absolute top-3 right-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full transition duration-300 hover:scale-110"
        >
          {darkMode ? <FaRegMoon className="text-yellow-400 text-xl" /> : <FaSun className="text-orange-500 text-xl" />}
        </button>
      </div>

      {/* Image */}
      <div className="mb-4">
        {localImage ? (
          <img src={localImage} alt={title} className="w-full h-64 object-cover rounded-lg" />
        ) : image ? (
          <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg" />
        ) : (
          <div className="text-center text-gray-500">No image available</div>
        )}
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight mb-2">{title}</h2>
      <p className="text-sm leading-relaxed">
        {expanded ? description : `${description.slice(0, 100)}...`}
        {description.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-blue-400 hover:underline text-xs"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <div className="mt-4">
        <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-3 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 shadow-lg"
          />
        </div>
        <p className="text-xs mt-1 opacity-80">{amountCollected} ETH raised of {target} ETH</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mt-5">
        <div>
          <p className="opacity-60">Remaining Time</p>
          <p className="font-semibold">{remainingTime}</p>
        </div>
        <div className="relative">
          <p className="opacity-60">Owner</p>
          <p className="font-mono cursor-pointer truncate hover:text-blue-400" title={owner}>
            {owner?.slice(0, 6)}...{owner?.slice(-4)}
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 18px rgba(0, 255, 220, 0.9)"
        }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setDonate(campaign);
          setTimeout(() => setOpenModel(true), 10);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }}
        className="w-full py-3 mt-5 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-2">
          <FaEthereum className="text-xl animate-pulse" />
          Donate
        </div>
      </motion.button>

      {isOwner && (
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-2 w-full border rounded-md"
            title="Upload Campaign Image"
          />
        </div>
      )}
    </motion.div>
  );
};

export default Card;
