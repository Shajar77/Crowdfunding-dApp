import React from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaGithub, FaLinkedinIn, FaDiscord } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const LINKS = {
  Platform: ["White Paper", "Launch Campaign", "Explore Projects", "Tokenomics"],
  Resources: ["Documentation", "Smart Contracts", "Audit Report", "Changelog"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
};

const SOCIALS = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaDiscord, href: "https://discord.com", label: "Discord" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];




const footerStyles = `
      /* ── Shell ────────────────────────────────────────────── */
      .ft {
        position: relative;
        background: linear-gradient(160deg, #f0fdf4 0%, #dcfce7 35%, #fff 60%, #f0fdf4 100%);
        border-top: 1px solid rgba(16,185,129,0.18);
        overflow: hidden;
        font-family: 'Inter', sans-serif;
      }

      /* Grid lines */
      .ft-grid {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        background-image:
          linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: radial-gradient(ellipse 80% 60% at 50% 100%, #000 0%, transparent 85%);
      }

      /* Corner orbs */
      .ft-orb {
        position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
      }
      .ft-orb-1 {
        width: 500px; height: 400px;
        bottom: -120px; left: -100px;
        background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%);
        filter: blur(48px);
      }
      .ft-orb-2 {
        width: 420px; height: 350px;
        top: -80px; right: -80px;
        background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
        filter: blur(48px);
      }

      /* Inner */
      .ft-inner {
        position: relative; z-index: 1;
        max-width: 1280px; margin: 0 auto;
        padding: 80px 32px 0;
      }



      /* ── Main grid ───────────────────────────────────────── */
      .ft-grid-main {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
        margin-bottom: 64px;
      }
      @media(min-width:768px) {
        .ft-grid-main { grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 32px; }
      }

      /* Brand column */
      .ft-brand-logo {
        font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
        font-size: 28px; font-weight: 800;
        letter-spacing: -0.04em;
        background: linear-gradient(135deg, #064e3b 0%, #10b981 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 14px; display: inline-block;
      }
      .ft-brand-desc {
        font-size: 14px; line-height: 1.7;
        color: #6b7280; max-width: 280px;
        margin-bottom: 24px; font-weight: 400;
      }
      .ft-socials { display: flex; gap: 8px; }
      .ft-social-btn {
        width: 38px; height: 38px; border-radius: 10px;
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(16,185,129,0.18);
        display: flex; align-items: center; justify-content: center;
        color: #047857; font-size: 14px;
        text-decoration: none;
        box-shadow: 0 2px 6px rgba(6,78,59,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
        transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        backdrop-filter: blur(8px);
      }
      .ft-social-btn:hover {
        transform: translateY(-2px);
        border-color: rgba(16,185,129,0.35);
        background: rgba(16,185,129,0.08);
        color: #10b981;
      }

      /* Link columns */
      .ft-col-head {
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        color: #064e3b; margin-bottom: 18px;
        display: flex; align-items: center; gap: 6px;
      }
      .ft-col-head::before {
        content: '';
        display: block; width: 16px; height: 2px; border-radius: 1px;
        background: linear-gradient(90deg, #10b981, #34d399);
        flex-shrink: 0;
      }
      .ft-col-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
      .ft-col-link {
        font-size: 13.5px; font-weight: 500;
        color: #6b7280; text-decoration: none;
        display: inline-flex; align-items: center; gap: 5px;
        transition: color 0.18s ease;
      }
      .ft-col-link:hover { color: #10b981; }
      .ft-col-link svg { opacity: 0; transition: opacity 0.18s ease, transform 0.18s ease; font-size: 10px; }
      .ft-col-link:hover svg { opacity: 1; transform: translate(1px,-1px); }

      /* ── Bottom bar ──────────────────────────────────────── */
      .ft-bottom {
        border-top: 1px solid rgba(16,185,129,0.12);
        padding: 24px 0 32px;
        display: flex; flex-wrap: wrap;
        align-items: center; justify-content: space-between;
        gap: 16px;
      }
      .ft-copy {
        font-size: 12.5px; color: #9ca3af; font-weight: 500;
      }
      .ft-copy strong { color: #065f46; font-weight: 700; }
      .ft-legal {
        display: flex; gap: 20px;
      }
      .ft-legal a {
        font-size: 12px; font-weight: 500;
        color: #9ca3af; text-decoration: none;
        transition: color 0.15s;
      }
      .ft-legal a:hover { color: #10b981; }
      .ft-badge {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 12px; border-radius: 999px;
        background: rgba(16,185,129,0.08);
        border: 1px solid rgba(16,185,129,0.18);
        font-size: 11px; font-weight: 700;
        color: #047857; letter-spacing: 0.04em;
      }
      .ft-badge-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 6px rgba(16,185,129,0.8);
      }
`;

const Footer = () => (
  <>
    <style>{footerStyles}</style>

    <footer className="ft">
      <div className="ft-grid" />
      <div className="ft-orb ft-orb-1" />
      <div className="ft-orb ft-orb-2" />

      <div className="ft-inner">



        {/* Main grid */}
        <div className="ft-grid-main">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="ft-brand-logo">Fundverse</div>
            <p className="ft-brand-desc">
              The next generation of decentralised crowdfunding. Launch campaigns, back ideas, and build the future — on-chain, transparent, borderless.
            </p>
            <div className="ft-socials">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="ft-social-btn"
                  target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items], ci) => (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: ci * 0.08 + 0.1 }}
            >
              <div className="ft-col-head">{col}</div>
              <ul className="ft-col-links">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="ft-col-link">
                      {item}
                      <FiArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © {new Date().getFullYear()} <strong>Fundverse</strong>. All rights reserved. A project by Tradewizzz.
          </p>
          <div className="ft-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="ft-badge">
            <span className="ft-badge-dot" />
            Mainnet Live
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
