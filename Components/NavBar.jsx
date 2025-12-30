import React, { useState, useContext, useEffect } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Logo } from "../Components";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = ["White Paper", "Project", "Donation", "Members"];

const navStyles = `
        /* Shell */
        .nb {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;
          font-family: 'Inter', sans-serif;
          transition: background 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
        }
        .nb.top {
          background: rgba(255,255,255,0.20);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(16,185,129,0.10);
          box-shadow: none;
        }
        .nb.scrolled {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-bottom: 1px solid rgba(16,185,129,0.20);
          box-shadow:
            0 1px 0 rgba(16,185,129,0.10),
            0 8px 40px rgba(6,78,59,0.06),
            0 2px 12px rgba(0,0,0,0.04);
        }

        /* Top shimmer line – only visible when scrolled */
        .nb-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(16,185,129,0.0) 10%,
            #10b981 35%,
            #34d399 50%,
            #059669 65%,
            rgba(5,150,105,0.0) 90%,
            transparent 100%
          );
          transition: opacity 0.45s ease;
          opacity: 0;
          pointer-events: none;
        }
        .nb.scrolled .nb-line { opacity: 1; }

        /* Container */
        .nb-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 0 32px; height: 70px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* ── Logo ───────────────────────────────────────────────── */
        .nb-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .nb-logo-img { display: flex; align-items: center; }

        /* ── Nav links (desktop) ────────────────────────────────── */
        .nb-links {
          display: none;
          list-style: none; margin: 0; padding: 0;
          gap: 2px; align-items: center;
        }
        @media(min-width:1024px){ .nb-links { display: flex; } }

        .nb-link {
          position: relative;
          display: inline-block;
          padding: 7px 15px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #065f46;
          text-decoration: none;
          transition: color 0.18s ease, background 0.18s ease;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: 5px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 70%; height: 2px;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 1px;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .nb-link:hover {
          color: #064e3b;
          background: rgba(16,185,129,0.10);
        }
        .nb-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* ── Divider ────────────────────────────────────────────── */
        .nb-divider {
          display: none;
          width: 1px; height: 22px;
          background: linear-gradient(to bottom, transparent, rgba(16,185,129,0.3), transparent);
          margin: 0 8px;
          flex-shrink: 0;
        }
        @media(min-width:1024px){ .nb-divider { display: block; } }

        /* ── Right section ──────────────────────────────────────── */
        .nb-right {
          display: flex; align-items: center; gap: 10px;
        }

        /* ── Connect button ─────────────────────────────────────── */
        .nb-btn {
          display: none;
          align-items: center; gap: 8px;
          padding: 10px 24px;
          border-radius: 999px;
          border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
          box-shadow:
            0 4px 16px rgba(16,185,129,0.28),
            0 1px 4px rgba(0,0,0,0.10),
            inset 0 1px 0 rgba(255,255,255,0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative; overflow: hidden;
          white-space: nowrap;
        }
        .nb-btn::before {
          content: '';
          position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.5s ease;
        }
        .nb-btn:hover::before { left: 140%; }
        .nb-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 8px 28px rgba(16,185,129,0.38),
            0 2px 8px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .nb-btn:active { transform: translateY(0); }
        @media(min-width:1024px){ .nb-btn { display: flex; } }

        /* ── Wallet badge ───────────────────────────────────────── */
        .nb-badge {
          display: none;
          align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(16,185,129,0.10);
          border: 1px solid rgba(16,185,129,0.30);
          font-family: 'Courier New', monospace;
          font-size: 12px; font-weight: 700;
          color: #065f46; letter-spacing: 0.04em;
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .nb-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #10b981;
          box-shadow: 0 0 0 2px rgba(16,185,129,0.25);
          flex-shrink: 0;
        }
        @media(min-width:1024px){ .nb-badge { display: flex; } }

        /* ── Hamburger ──────────────────────────────────────────── */
        .nb-ham {
          display: flex;
          flex-direction: column; justify-content: center; align-items: center;
          gap: 5px;
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.18);
          cursor: pointer; padding: 0; flex-shrink: 0;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .nb-ham:hover {
          background: rgba(16,185,129,0.14);
          border-color: rgba(16,185,129,0.28);
        }
        @media(min-width:1024px){ .nb-ham { display: none; } }
        .nb-bar {
          display: block;
          width: 18px; height: 1.8px;
          background: #065f46;
          border-radius: 2px;
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
        }

        /* ── Mobile drawer ──────────────────────────────────────── */
        .nb-drawer {
          overflow: hidden;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-top: 1px solid rgba(16,185,129,0.10);
          box-shadow: 0 16px 48px rgba(6,78,59,0.08);
        }
        .nb-drawer-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 16px 28px 24px;
        }
        .nb-mob-link {
          display: flex; align-items: center;
          padding: 12px 14px; border-radius: 12px;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #065f46; text-decoration: none;
          transition: all 0.18s ease;
          border: 1px solid transparent;
        }
        .nb-mob-link:hover {
          background: rgba(16,185,129,0.08);
          border-color: rgba(16,185,129,0.18);
          color: #064e3b;
          padding-left: 20px;
        }
        .nb-mob-sep {
          height: 1px; margin: 12px 0;
          background: linear-gradient(90deg, rgba(16,185,129,0.18), transparent);
        }
        .nb-mob-btn {
          width: 100%; padding: 14px 20px;
          border-radius: 14px; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
          box-shadow: 0 4px 20px rgba(16,185,129,0.25);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .nb-mob-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(16,185,129,0.35);
        }
        .nb-mob-badge {
          width: 100%; padding: 13px 18px;
          border-radius: 14px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.22);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'Courier New', monospace;
          font-size: 13px; font-weight: 700;
          color: #065f46;
        }
`;

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* ── Injected styles ───────────────────────────────────────────── */}
      <style>{navStyles}</style>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className={`nb ${scrolled ? "scrolled" : "top"}`}>
        <div className="nb-line" />

        <div className="nb-wrap">

          {/* Logo */}
          <a href="/" className="nb-logo">
            <div className="nb-logo-img">
              <Logo color="text-green-800" />
            </div>
          </a>

          {/* Desktop links */}
          <ul className="nb-links">
            {NAV_LINKS.map((item, i) => (
              <li key={i}>
                <a href="#" className="nb-link">{item}</a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="nb-right">
            {/* Vertical rule */}
            <div className="nb-divider" />

            {/* Wallet state */}
            {!currentAccount ? (
              <button className="nb-btn" onClick={connectWallet}>
                {/* Wallet icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                  <circle cx="17" cy="15" r="1" fill="currentColor" />
                </svg>
                Connect Wallet
              </button>
            ) : (
              <div className="nb-badge">
                <span className="nb-badge-dot" />
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </div>
            )}

            {/* Hamburger */}
            <button
              className="nb-ham"
              onClick={() => setIsMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="nb-bar" style={{
                transform: isMenuOpen ? "translateY(6.8px) rotate(45deg)" : "none"
              }} />
              <span className="nb-bar" style={{
                opacity: isMenuOpen ? 0 : 1,
                transform: isMenuOpen ? "scaleX(0)" : "none"
              }} />
              <span className="nb-bar" style={{
                transform: isMenuOpen ? "translateY(-6.8px) rotate(-45deg)" : "none"
              }} />
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="nb-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="nb-drawer-inner">
                {NAV_LINKS.map((item, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="nb-mob-link"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055 + 0.04 }}
                  >
                    {item}
                  </motion.a>
                ))}

                <div className="nb-mob-sep" />

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                >
                  {!currentAccount ? (
                    <button
                      className="nb-mob-btn"
                      onClick={() => { connectWallet(); setIsMenuOpen(false); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M2 10h20" />
                        <circle cx="17" cy="15" r="1" fill="currentColor" />
                      </svg>
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="nb-mob-badge">
                      <span className="nb-badge-dot" />
                      {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default NavBar;
