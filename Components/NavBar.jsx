import React, { useState, useContext, useEffect, useCallback, memo, useMemo } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/donation" },
  { label: "Launch Campaign", href: "/launch" },
  { label: "Project", href: "/project" },
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
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Optimized scroll handler with passive event listener
  useEffect(() => {
    setIsMounted(true);
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
    <nav className={`nb ${isMounted && scrolled ? "scrolled" : "top"}`}>
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
              <Link href={href} className={`nb-link ${router.pathname === href ? "active" : ""}`}>
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
              <span className="nb-btn-dot" aria-hidden="true" />
              <span className="nb-btn-text">Connect Wallet</span>
            </button>
          ) : (
            <div className="nb-btn" aria-label={`Connected: ${formattedAccount}`} style={{ cursor: 'default' }}>
              <span className="nb-btn-dot" aria-hidden="true" />
              <span className="nb-btn-text">{formattedAccount}</span>
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
                <div className={`nb-mob-link ${router.pathname === href ? "active" : ""}`}>
                  {label}
                </div>
              </Link>
            ))}

            <div className="nb-mob-sep" />

            {!currentAccount ? (
              <button className="nb-mob-btn" onClick={handleConnect}>
                <span className="nb-btn-dot" aria-hidden="true" />
                <span className="nb-btn-text">Connect Wallet</span>
              </button>
            ) : (
              <div className="nb-mob-btn" style={{ cursor: 'default' }}>
                <span className="nb-btn-dot" aria-hidden="true" />
                <span className="nb-btn-text">{formattedAccount}</span>
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
