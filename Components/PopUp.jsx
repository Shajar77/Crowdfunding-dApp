import React, { useState, useEffect } from "react";

const PopUp = ({ setOpenModel, donate, donateFunction }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  if (!donate) return null; // ✅ No warning, just wait silently

  const {
    id,
    title,
    description,
    amountCollected,
    target,
    deadline,
  } = donate;

  const progress = Math.min((amountCollected / target) * 100, 100).toFixed(1);

  useEffect(() => {
    if (deadline) {
      const diff = new Date(Number(deadline) * 1000).getTime() - Date.now();
      setDaysLeft(Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0));
    }
  }, [deadline]);

  const handleDonate = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      await donateFunction(id, amount);
      alert("🎉 Donation successful!");
      setAmount("");
      setOpenModel(false);
    } catch (error) {
      console.error("Donation failed:", error);
      alert("⚠️ Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl border-2 border-blue-400">
        <h2 className="text-xl font-bold mb-1 text-blue-700">{title}</h2>
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mb-1">
          {amountCollected} ETH raised of {target} ETH
        </p>
        <p className="text-xs text-gray-400 mb-4">
          ⏳ {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
        </p>

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-between">
          <button
            onClick={handleDonate}
            disabled={loading}
            className={`${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded-md transition`}
          >
            {loading ? "Processing..." : "Donate"}
          </button>

          <button
            onClick={() => setOpenModel(false)}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
