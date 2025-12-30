import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Logo } from "../Components";
import { AnimatePresence, motion } from "framer-motion";

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White Paper", "Project", "Donation", "Members"];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Glowing ring */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg blur-2xl"></div>

        {/* Logo only (slightly bigger) */}
        <a href="/" className="flex items-center group scale-110">
          <Logo color="text-white" />
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-10 items-center">
          {menuList.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 text-md font-medium tracking-wide transition-all duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Wallet Status */}
        <div className="hidden lg:flex items-center space-x-4">
          {!currentAccount ? (
            <button
              onClick={connectWallet}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white rounded-full font-semibold shadow-lg transition duration-300"
            >
              🔗 Connect Wallet
            </button>
          ) : (
            <div className="px-4 py-2 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-green-400 border border-green-500 rounded-full font-mono text-sm shadow-inner">
              ✅ {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </div>
          )}
        </div>


        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden bg-black/90 text-white px-6 py-6"
          >
            <ul className="space-y-4 text-center">
              {menuList.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-lg font-medium hover:text-green-400 transition duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-center">
              {!currentAccount ? (
                <button
                  onClick={connectWallet}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white rounded-full font-semibold transition"
                >
                  🔗 Connect Wallet
                </button>
              ) : (
                <div className="py-3 bg-gray-900 text-green-400 rounded-xl font-mono text-sm mt-2">
                  ✅ {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
