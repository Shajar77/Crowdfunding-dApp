import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEyeOff, FiTrash2, FiClock, FiUser, FiTarget } from "react-icons/fi";

const cardStyles = `
        .cc-card {
          position: relative;
          border-radius: 24px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(16,185,129,0.18);
          box-shadow:
            0 4px 24px rgba(6,78,59,0.07),
            0 1px 4px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.9);
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.25s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.25s ease;
          display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif;
        }
        .cc-card:hover {
          transform: translateY(-4px);
          border-color: rgba(16,185,129,0.32);
          box-shadow:
            0 12px 40px rgba(6,78,59,0.12),
            0 4px 12px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .cc-img-wrap {
          position: relative;
          width: 100%; height: 200px; overflow: hidden;
          background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.06));
        }
        .cc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }
        .cc-card:hover .cc-img { transform: scale(1.04); }
        .cc-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(6,78,59,0.12) 100%);
          pointer-events: none;
        }
        .cc-sample-badge {
          position: absolute; top: 12px; left: 12px;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(16,185,129,0.3);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #047857;
          backdrop-filter: blur(8px);
        }
        .cc-cat-tag {
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.25);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #065f46;
          backdrop-filter: blur(8px);
        }
        .cc-owner-btns {
          position: absolute; top: 12px; left: 12px;
          display: flex; gap: 6px;
        }
        .cc-icon-btn {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer;
          font-size: 13px;
          backdrop-filter: blur(8px);
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .cc-icon-btn:hover { transform: scale(1.1); }
        .cc-del-btn {
          background: rgba(254,202,202,0.9);
          color: #dc2626;
          border: 1px solid rgba(220,38,38,0.2);
        }
        .cc-hide-btn {
          background: rgba(254,240,138,0.9);
          color: #b45309;
          border: 1px solid rgba(180,83,9,0.2);
        }
        .cc-no-img {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          color: #6b7280; font-size: 13px; font-weight: 500;
        }
        .cc-no-img svg { opacity: 0.3; }
        .cc-body {
          padding: 20px 22px 0;
          flex: 1; display: flex; flex-direction: column;
        }
        .cc-title {
          font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #064e3b; line-height: 1.25;
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .cc-desc {
          font-size: 13px; line-height: 1.65;
          color: #6b7280; font-weight: 400;
          margin-bottom: 16px; flex: 1;
        }
        .cc-readmore {
          background: none; border: none; cursor: pointer;
          font-size: 12px; font-weight: 600;
          color: #10b981; padding: 0;
          transition: color 0.15s;
        }
        .cc-readmore:hover { color: #059669; }
        .cc-progress-wrap { margin-bottom: 16px; }
        .cc-progress-track {
          height: 6px; border-radius: 999px;
          background: rgba(16,185,129,0.10);
          overflow: hidden; margin-bottom: 8px;
        }
        .cc-progress-bar {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #10b981, #34d399);
          box-shadow: 0 0 8px rgba(16,185,129,0.4);
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        .cc-progress-labels {
          display: flex; justify-content: space-between;
          align-items: center;
        }
        .cc-raised {
          font-size: 13px; font-weight: 700;
          color: #065f46;
          display: flex; align-items: center; gap: 4px;
        }
        .cc-target {
          font-size: 11.5px; color: #9ca3af; font-weight: 500;
        }
        .cc-eth-icon {
          font-size: 11px; font-weight: 800;
          background: linear-gradient(135deg, #10b981, #059669);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cc-meta {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 18px;
        }
        .cc-meta-item {
          padding: 10px 12px; border-radius: 12px;
          background: rgba(16,185,129,0.05);
          border: 1px solid rgba(16,185,129,0.10);
        }
        .cc-meta-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        .cc-meta-value {
          font-size: 13px; font-weight: 700;
          color: #065f46; font-family: 'Courier New', monospace;
        }
        .cc-footer { padding: 0 22px 22px; }
        .cc-donate-btn {
          width: 100%; padding: 13px;
          border-radius: 14px; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.01em; color: #fff;
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%);
          box-shadow: 0 4px 16px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.15);
          position: relative; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cc-donate-btn::before {
          content: '';
          position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .cc-donate-btn:hover::before { left: 150%; }
        .cc-donate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .cc-donate-btn:active { transform: translateY(0); }
        .cc-divider {
          height: 1px; margin: 0 22px 18px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent);
        }
`;

const Card = ({
  campaign,
  setOpenModel,
  setDonate,
  onDelete,
  onToggleHidden,
  isHidden,
  currentAccount,
  isSample = false,
}) => {
  if (!campaign) return null;

  const { title, description, target, deadline, amountCollected, owner, id, image } = campaign;

  const [expanded, setExpanded] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const isOwner = !isSample && currentAccount?.toLowerCase() === owner?.toLowerCase();
  const progress = Math.min((Number(amountCollected) / Number(target)) * 100, 100);

  useEffect(() => {
    if (isSample) { setRemainingTime(deadline); return; }
    const update = () => {
      const left = Number(deadline) * 1000 - Date.now();
      if (left <= 0) { setRemainingTime("Expired"); return; }
      const d = Math.floor(left / 86400000);
      const h = Math.floor((left / 3600000) % 24);
      const m = Math.floor((left / 60000) % 60);
      setRemainingTime(`${d}d ${h}h ${m}m`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [deadline, isSample]);

  const shortDesc = description.length > 110 ? description.slice(0, 110) + "…" : description;

  return (
    <>
      <style>{cardStyles}</style>

      <motion.div
        className="cc-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        layout
      >
        {/* Image */}
        <div className="cc-img-wrap">
          {image ? (
            <>
              <img src={image} alt={title} className="cc-img" />
              <div className="cc-img-overlay" />
            </>
          ) : (
            <div className="cc-no-img">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>No image uploaded</span>
            </div>
          )}
          {isSample && <span className="cc-sample-badge">✦ Sample</span>}
          {campaign.category && <span className="cc-cat-tag">{campaign.category}</span>}
          {isOwner && (
            <div className="cc-owner-btns">
              <button className="cc-icon-btn cc-del-btn" onClick={() => onDelete(id)} title="Delete">
                <FiTrash2 />
              </button>
              <button className="cc-icon-btn cc-hide-btn" onClick={() => onToggleHidden(id)} title="Hide">
                <FiEyeOff />
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="cc-body">
          <div className="cc-title">{title}</div>

          <p className="cc-desc">
            {expanded ? description : shortDesc}
            {description.length > 110 && (
              <button className="cc-readmore" onClick={() => setExpanded(e => !e)}>
                {expanded ? " Show less" : " Read more"}
              </button>
            )}
          </p>

          {/* Progress */}
          <div className="cc-progress-wrap">
            <div className="cc-progress-track">
              <div className="cc-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="cc-progress-labels">
              <span className="cc-raised">
                <span className="cc-eth-icon">Ξ</span>
                {Number(amountCollected).toFixed(2)} raised
              </span>
              <span className="cc-target">of Ξ {Number(target).toFixed(2)}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="cc-meta">
            <div className="cc-meta-item">
              <div className="cc-meta-label"><FiClock size={9} /> Time Left</div>
              <div className="cc-meta-value">{remainingTime || "—"}</div>
            </div>
            <div className="cc-meta-item">
              <div className="cc-meta-label"><FiUser size={9} /> Owner</div>
              <div className="cc-meta-value" style={{ fontSize: 11 }}>
                {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="cc-divider" />

        {/* CTA */}
        {!isSample && (
          <div className="cc-footer">
            <button
              className="cc-donate-btn"
              onClick={() => {
                if (setDonate && setOpenModel) {
                  setDonate(campaign);
                  setTimeout(() => setOpenModel(true), 10);
                }
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Back This Project
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Card;
