import React, { useState, useContext, useEffect, useCallback, memo, useMemo } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Logo } from "../Components";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "White Paper", href: "/whitepaper" },
  { label: "Project", href: "/project" },
  { label: "Donation", href: "/donation" },
];

const WalletIcon = memo(() => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <circle cx="17" cy="15" r="1" fill="currentColor" />
  </svg>
));
WalletIcon.displayName = "WalletIcon";

const NavBar = memo(() => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Optimized scroll handler with passive event listener
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check initial state
    handleScroll();
    
    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized callbacks
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  
  const handleConnect = useCallback(() => {
    connectWallet();
    closeMenu();
  }, [connectWallet, closeMenu]);

  // Memoize formatted account address
  const formattedAccount = useMemo(() => 
    currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : null,
    [currentAccount]
  );

  return (
    <nav className={`nb ${scrolled ? "scrolled" : "top"}`}>
      <div className="nb-line" />

      <div className="nb-wrap">
        {/* Logo */}
        <a href="/" className="nb-logo" aria-label="Home">
          <div className="nb-logo-img">
            <Logo />
          </div>
        </a>

        {/* Desktop links */}
        <ul className="nb-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className="nb-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="nb-right">
          <div className="nb-divider" />

          {!currentAccount ? (
            <button 
              className="nb-btn" 
              onClick={connectWallet}
              aria-label="Connect wallet"
            >
              <WalletIcon />
              Connect Wallet
            </button>
          ) : (
            <div className="nb-badge" aria-label={`Connected: ${formattedAccount}`}>
              <span className="nb-badge-dot" aria-hidden="true" />
              {formattedAccount}
            </div>
          )}

          {/* Hamburger */}
          <button
            className="nb-ham"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span 
              className="nb-bar" 
              style={{
                transform: isMenuOpen ? "translateY(6.8px) rotate(45deg)" : "none"
              }}
              aria-hidden="true"
            />
            <span 
              className="nb-bar" 
              style={{
                opacity: isMenuOpen ? 0 : 1,
                transform: isMenuOpen ? "scaleX(0)" : "none"
              }}
              aria-hidden="true"
            />
            <span 
              className="nb-bar" 
              style={{
                transform: isMenuOpen ? "translateY(-6.8px) rotate(-45deg)" : "none"
              }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="nb-drawer" id="mobile-menu">
          <div className="nb-drawer-inner">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={closeMenu}>
                <div className="nb-mob-link">
                  {label}
                </div>
              </Link>
            ))}

            <div className="nb-mob-sep" />

            {!currentAccount ? (
              <button className="nb-mob-btn" onClick={handleConnect}>
                <WalletIcon />
                Connect Wallet
              </button>
            ) : (
              <div className="nb-mob-badge">
                <span className="nb-badge-dot" />
                {formattedAccount}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

NavBar.displayName = "NavBar";
export default NavBar;
