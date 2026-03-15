import React, { memo } from "react";

const IconTwitter = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.4-1.6.8-2.5.9a3.8 3.8 0 0 0-6.6 2.6c0 .3 0 .6.1.9A10.8 10.8 0 0 1 3 4.7a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.4v.1c0 1.8 1.3 3.3 3 3.6-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 2 2.6 3.8 2.6A7.7 7.7 0 0 1 2 18.1a10.9 10.9 0 0 0 5.9 1.7c7 0 10.9-5.8 10.9-10.9v-.5c.8-.5 1.4-1.2 1.9-2z" />
  </svg>
);

const IconGithub = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.9.6-3.5-1.2-3.5-1.2-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.8 1.5-.8 0-.8.3-1.3.6-1.6-2.3-.2-4.7-1.1-4.7-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.9-.3 2.8 1a9.7 9.7 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.6 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.7 5 .3.3.6.8.6 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
  </svg>
);

const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h4v1.7c.6-1 1.6-2 3.4-2 3 0 4.6 1.7 4.6 5.1V21h-4v-6c0-1.7-.6-2.7-2-2.7-1.1 0-1.7.7-2 1.4-.1.2-.1.6-.1.9V21H9z" />
  </svg>
);

const IconDiscord = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20 4.7A19.2 19.2 0 0 0 15.6 3c-.2.3-.4.8-.5 1.1a18.2 18.2 0 0 0-5.2 0c-.1-.3-.3-.8-.5-1.1A19.2 19.2 0 0 0 5 4.7C2.7 8.1 2 11.4 2.3 14.6A19.5 19.5 0 0 0 8 18.4c.5-.7.9-1.5 1.2-2.2-.7-.2-1.3-.5-1.9-.8.2-.1.3-.2.5-.3 3.6 1.7 7.5 1.7 11.1 0 .2.1.3.2.5.3-.6.3-1.2.6-1.9.8.3.7.7 1.5 1.2 2.2a19.5 19.5 0 0 0 5.7-3.8c.4-3.8-.7-7.1-2.9-9.9zM9.6 13.2c-.9 0-1.6-.8-1.6-1.7 0-1 .7-1.7 1.6-1.7s1.6.8 1.6 1.7-.7 1.7-1.6 1.7zm4.8 0c-.9 0-1.6-.8-1.6-1.7 0-1 .7-1.7 1.6-1.7s1.6.8 1.6 1.7-.7 1.7-1.6 1.7z" />
  </svg>
);

const IconArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M7 17L17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

const LINKS = {
  Platform: ["White Paper", "Launch Campaign", "Explore Projects", "Tokenomics"],
  Resources: ["Documentation", "Smart Contracts", "Audit Report", "Changelog"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
};

const SOCIALS = [
  { icon: IconTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: IconDiscord, href: "https://discord.com", label: "Discord" },
  { icon: IconGithub, href: "https://github.com", label: "GitHub" },
  { icon: IconLinkedIn, href: "https://linkedin.com", label: "LinkedIn" },
];

const Footer = memo(() => (
    <footer className="ft">
      <div className="ft-grid" />
      <div className="ft-orb ft-orb-1" />
      <div className="ft-orb ft-orb-2" />

      <div className="ft-inner">

        {/* Main grid */}
        <div className="ft-grid-main">
          {/* Brand */}
          <div>
            <div className="ft-brand-logo">Fundverse</div>
            <p className="ft-brand-desc">
              The next generation of decentralised crowdfunding. Launch campaigns, back ideas, and build the future — on-chain, transparent, borderless.
            </p>
            <div className="ft-socials">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="ft-social-btn"
                  target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items], ci) => (
            <div
              key={col}
            >
              <div className="ft-col-head">{col}</div>
              <ul className="ft-col-links">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="ft-col-link">
                      {item}
                      <IconArrowUpRight width={12} height={12} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div
          className="ft-cta"
        >
          <div className="ft-cta-title">Stay in the <span>Loop</span></div>
          <p className="ft-cta-sub">
            Get weekly updates on trending campaigns, platform news, and Web3 insights.
          </p>
          <form className="ft-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input
              className="ft-cta-input"
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button className="ft-cta-btn" type="submit">Subscribe</button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> <strong>Fundverse</strong>. All rights reserved. A project by Tradewizzz.
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
));

Footer.displayName = "Footer";

export default Footer;
