import React, { useState, useEffect } from "react";

const IconEthereum = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 2l6 10-6 4-6-4 6-10z" />
    <path d="M6 12l6 4 6-4" />
    <path d="M12 16v6" />
  </svg>
);

const IconShield = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconCheckCircle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </svg>
);

const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M6 6l12 12M18 6l-12 12" />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </svg>
);

const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" />
  </svg>
);

const IconHeart = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ── Inline styles (matches emerald design system) ──────────────── */
const popupStyles = `
  /* ── Backdrop ──────────────────────────────────────────────── */
  .pu-backdrop {
    position: fixed; inset: 0; z-index: 10000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    background: rgba(2, 44, 34, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* ── Card shell ────────────────────────────────────────────── */
  .pu-card {
    position: relative;
    width: 100%; max-width: 480px;
    border-radius: 28px;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 55%),
      linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,255,251,0.95) 100%);
    border: 1px solid rgba(16,185,129,0.22);
    box-shadow:
      0 30px 90px -18px rgba(0,0,0,0.32),
      0 0 0 1px rgba(16,185,129,0.12),
      0 0 70px -25px rgba(16,185,129,0.18);
    font-family: 'Inter', sans-serif;
  }

  /* Shimmer top line */
  .pu-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(16,185,129,0.0) 15%,
      #10b981 40%, #34d399 55%, #059669 70%,
      rgba(5,150,105,0.0) 85%,
      transparent 100%
    );
    z-index: 2;
  }

  /* ── Close button ──────────────────────────────────────────── */
  .pu-close {
    position: absolute; top: 16px; right: 16px; z-index: 3;
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(16,185,129,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #6b7280; font-size: 15px;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
  }
  .pu-close:hover {
    background: rgba(254,202,202,0.25);
    border-color: rgba(220,38,38,0.2);
    color: #dc2626;
    transform: rotate(90deg);
  }

  /* ── Header ────────────────────────────────────────────────── */
  .pu-header {
    padding: 28px 28px 20px;
    border-bottom: 1px solid rgba(16,185,129,0.10);
  }
  .pu-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #047857; margin-bottom: 10px;
  }
  .pu-eyebrow::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px rgba(16,185,129,0.8);
  }
  .pu-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), 'Inter', sans-serif;
    font-size: 22px; font-weight: 800;
    color: #064e3b; line-height: 1.2;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .pu-desc {
    font-size: 13px; line-height: 1.6;
    color: #6b7280; font-weight: 400;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* ── Progress section ──────────────────────────────────────── */
  .pu-progress {
    padding: 20px 28px;
    border-bottom: 1px solid rgba(16,185,129,0.08);
  }
  .pu-prog-track {
    height: 8px; border-radius: 999px;
    background: rgba(16,185,129,0.10);
    overflow: hidden; margin-bottom: 10px;
  }
  .pu-prog-bar {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, #10b981, #34d399);
    box-shadow: 0 0 8px rgba(16,185,129,0.4);
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }
  .pu-prog-labels {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 14px;
  }
  .pu-raised {
    display: flex; align-items: center; gap: 4px;
    font-size: 14px; font-weight: 700; color: #065f46;
  }
  .pu-raised-icon {
    font-size: 12px; font-weight: 800;
    background: linear-gradient(135deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .pu-target-text {
    font-size: 12px; color: #9ca3af; font-weight: 500;
  }

  /* Meta chips */
  .pu-meta {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .pu-meta-item {
    padding: 10px 12px; border-radius: 12px;
    background: rgba(16,185,129,0.05);
    border: 1px solid rgba(16,185,129,0.10);
  }
  .pu-meta-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #9ca3af; display: flex; align-items: center; gap: 4px;
    margin-bottom: 3px;
  }
  .pu-meta-value {
    font-size: 13px; font-weight: 700;
    color: #065f46; font-family: 'Courier New', monospace;
  }

  /* ── Body (input section) ──────────────────────────────────── */
  .pu-body {
    padding: 22px 28px 24px;
  }
  .pu-input-label {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #047857; margin-bottom: 6px;
  }
  .pu-input-wrap {
    position: relative; display: flex; align-items: center;
    border-radius: 14px;
    background: rgba(16,185,129,0.04);
    border: 1.5px solid rgba(16,185,129,0.18);
    padding: 0 16px;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    margin-bottom: 6px;
  }
  .pu-input-wrap:focus-within {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.10), 0 4px 12px rgba(16,185,129,0.08);
  }
  .pu-input-icon {
    color: #10b981; font-size: 16px; flex-shrink: 0;
    margin-right: 10px;
  }
  .pu-input {
    flex: 1; padding: 14px 0;
    background: transparent; border: none; outline: none;
    color: #064e3b; font-size: 16px; font-weight: 600;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.01em;
  }
  .pu-input::placeholder {
    color: #a7d5c4; font-weight: 400;
  }
  .pu-input-suffix {
    font-size: 12px; font-weight: 700; color: #9ca3af;
    flex-shrink: 0; margin-left: 8px;
  }
  .pu-usd-hint {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 99px;
    font-size: 11px; font-weight: 600; color: #059669;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.12);
    margin-bottom: 18px;
  }

  /* ── Actions ───────────────────────────────────────────────── */
  .pu-actions {
    display: flex; gap: 10px;
  }
  .pu-donate-btn {
    flex: 1; padding: 14px;
    border-radius: 16px; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.01em; color: #fff;
    background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
    box-shadow: 0 10px 28px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
    position: relative; overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .pu-donate-btn::before {
    content: '';
    position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .pu-donate-btn:hover::before { left: 150%; }
  .pu-donate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .pu-donate-btn:active { transform: translateY(0); }
  .pu-donate-btn:disabled {
    opacity: 0.5; cursor: not-allowed;
    transform: none !important;
    filter: saturate(0.3);
  }

  .pu-cancel-btn {
    padding: 14px 22px;
    border-radius: 14px; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600;
    color: #6b7280;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(16,185,129,0.18);
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }
  .pu-cancel-btn:hover {
    background: rgba(255,255,255,0.9);
    border-color: rgba(16,185,129,0.3);
    color: #064e3b;
  }

  /* ── Trust footer ──────────────────────────────────────────── */
  .pu-trust {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    padding: 14px 28px 18px;
    border-top: 1px solid rgba(16,185,129,0.08);
  }
  .pu-trust-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    color: #9ca3af; text-transform: uppercase;
  }
  .pu-trust-item svg { color: rgba(16,185,129,0.5); }
  .pu-trust-sep {
    width: 2px; height: 2px; border-radius: 50%;
    background: rgba(16,185,129,0.2);
  }

  /* ── Spinner ───────────────────────────────────────────────── */
  .pu-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: puSpin 0.7s linear infinite;
  }
  @keyframes puSpin { to { transform: rotate(360deg); } }

  /* ── Error shake ───────────────────────────────────────────── */
  .pu-err-input {
    border-color: rgba(248,113,113,0.5) !important;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important;
  }
  .pu-err-msg {
    font-size: 11px; color: #f87171; font-weight: 600;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── Success overlay ───────────────────────────────────────── */
  .pu-success {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(8px);
    text-align: center; padding: 40px;
  }
  .pu-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #34d399);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 28px; margin-bottom: 18px;
    box-shadow: 0 8px 24px rgba(16,185,129,0.3);
  }
  .pu-success-title {
    font-family: var(--font-bricolage, var(--font-bricolage, "Bricolage Grotesque")), sans-serif;
    font-size: 22px; font-weight: 800;
    color: #064e3b; margin-bottom: 6px;
  }
  .pu-success-sub {
    font-size: 13px; color: #6b7280; font-weight: 400;
    margin-bottom: 20px;
  }
  .pu-success-btn {
    padding: 12px 32px; border-radius: 14px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 16px rgba(16,185,129,0.25);
    transition: transform 0.2s ease;
  }
  .pu-success-btn:hover { transform: translateY(-2px); }
`;

const PopUp = ({ setOpenModel, donate, donateFunction }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [daysLeft, setDaysLeft] = useState("");

  if (!donate) return null;

  const {
    id, title, description,
    amountCollected, target, deadline, owner,
  } = donate;

  const progress = Math.min((Number(amountCollected) / Number(target)) * 100, 100);
  const usd = ((parseFloat(amount) || 0) * 3200).toLocaleString("en-US", { maximumFractionDigits: 0 });

  useEffect(() => {
    if (!deadline) return;
    const update = () => {
      const left = Number(deadline) * 1000 - Date.now();
      if (left <= 0) { setDaysLeft("Expired"); return; }
      const d = Math.floor(left / 86400000);
      const h = Math.floor((left / 3600000) % 24);
      setDaysLeft(`${d}d ${h}h`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [deadline]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpenModel(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpenModel]);

  const handleDonate = async () => {
    setError("");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid ETH amount");
      return;
    }
    setLoading(true);
    try {
      await donateFunction(id, amount);
      setSuccess(true);
    } catch (err) {
      console.error("Donation failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{popupStyles}</style>

      <div
        className="pu-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenModel(false);
        }}
      >
        <div
          className="pu-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button className="pu-close" onClick={() => setOpenModel(false)} aria-label="Close">
            <IconClose width={14} height={14} />
          </button>

          {/* Success overlay */}
          {success && (
            <div className="pu-success">
              <div className="pu-success-icon">
                <IconCheckCircle width={22} height={22} />
              </div>
              <div className="pu-success-title">Donation Sent!</div>
              <p className="pu-success-sub">
                You've backed "{title}" with Ξ {amount}. Thank you for supporting this project.
              </p>
              <button className="pu-success-btn" onClick={() => setOpenModel(false)}>
                Done
              </button>
            </div>
          )}

          {/* Header */}
          <div className="pu-header">
            <div className="pu-eyebrow">Back This Project</div>
            <h2 className="pu-title">{title}</h2>
            <p className="pu-desc">{description}</p>
          </div>

          {/* Progress */}
          <div className="pu-progress">
            <div className="pu-prog-track">
              <div
                className="pu-prog-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="pu-prog-labels">
              <span className="pu-raised">
                <span className="pu-raised-icon">Ξ</span>
                {Number(amountCollected).toFixed(2)} raised
              </span>
              <span className="pu-target-text">of Ξ {Number(target).toFixed(2)}</span>
            </div>

            <div className="pu-meta">
              <div className="pu-meta-item">
                <div className="pu-meta-label"><IconClock width={10} height={10} /> Time Left</div>
                <div className="pu-meta-value">{daysLeft || "—"}</div>
              </div>
              <div className="pu-meta-item">
                <div className="pu-meta-label"><IconUser width={10} height={10} /> Owner</div>
                <div className="pu-meta-value" style={{ fontSize: 11 }}>
                  {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="pu-body">
            <div className="pu-input-label">Donation Amount</div>
            <div className={`pu-input-wrap ${error ? "pu-err-input" : ""}`}>
              <IconEthereum className="pu-input-icon" />
              <input
                className="pu-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                autoFocus
                aria-label="Donation amount in ETH"
              />
              <span className="pu-input-suffix">ETH</span>
            </div>

            {amount && !error && (
              <div className="pu-usd-hint">
                <IconEthereum width={10} height={10} /> ≈&nbsp;${usd}
              </div>
            )}

            {error && (
              <p className="pu-err-msg">
                {error}
              </p>
            )}

            <div className="pu-actions">
              <button
                className="pu-donate-btn"
                onClick={handleDonate}
                disabled={loading}
              >
                {loading ? (
                  <><div className="pu-spin" />&nbsp;Processing…</>
                ) : (
                  <>
                    <IconHeart width={14} height={14} />
                    Donate Now
                  </>
                )}
              </button>
              <button className="pu-cancel-btn" onClick={() => setOpenModel(false)}>
                Cancel
              </button>
            </div>
          </div>

          {/* Trust footer */}
          <div className="pu-trust">
            <div className="pu-trust-item"><IconShield width={10} height={10} /> Audited</div>
            <div className="pu-trust-sep" />
            <div className="pu-trust-item"><IconCheckCircle width={10} height={10} /> Non-custodial</div>
            <div className="pu-trust-sep" />
            <div className="pu-trust-item"><IconEthereum width={10} height={10} /> 0% Fee</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUp;
