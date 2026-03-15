import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import Image from "next/image";

const IconEyeOff = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.74-2.05 2.1-3.85 3.92-5.23" />
    <path d="M10.58 10.58a2.5 2.5 0 0 0 3.54 3.54" />
    <path d="M9.9 5.1A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8-1.1 3.05-3.5 5.54-6.6 6.83" />
    <path d="M2 2l20 20" />
  </svg>
);

const IconTrash = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 14h10l1-14" />
    <path d="M10 11v6M14 11v6" />
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

const Card = memo(({
  campaign,
  setOpenModel,
  setDonate,
  onDelete,
  onToggleHidden,
  currentAccount,
  isSample = false,
  priority = false,
}) => {
  if (!campaign) return null;

  const { title, description, target, deadline, amountCollected, owner, id, image, category } = campaign;

  const [expanded, setExpanded] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  // Memoize expensive calculations
  const isOwner = useMemo(() => 
    !isSample && currentAccount?.toLowerCase() === owner?.toLowerCase(),
    [isSample, currentAccount, owner]
  );

  const progress = useMemo(() => 
    Math.min((Number(amountCollected) / Number(target)) * 100, 100),
    [amountCollected, target]
  );

  const shortDesc = useMemo(() => 
    description.length > 110 ? description.slice(0, 110) + "…" : description,
    [description]
  );

  const formattedOwner = useMemo(() => 
    owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—",
    [owner]
  );

  const formattedAmountCollected = useMemo(() => 
    Number(amountCollected).toFixed(2),
    [amountCollected]
  );

  const formattedTarget = useMemo(() => 
    Number(target).toFixed(2),
    [target]
  );

  // Optimized timer effect
  useEffect(() => {
    if (isSample) { 
      setRemainingTime(deadline || "—"); 
      return; 
    }

    const update = () => {
      const left = Number(deadline) * 1000 - Date.now();
      if (left <= 0) { 
        setRemainingTime("Expired"); 
        return; 
      }
      const d = Math.floor(left / 86400000);
      const h = Math.floor((left / 3600000) % 24);
      const m = Math.floor((left / 60000) % 60);
      setRemainingTime(`${d}d ${h}h ${m}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deadline, isSample]);

  // Memoized callbacks
  const handleDonate = useCallback(() => {
    if (setDonate && setOpenModel) {
      setDonate(campaign);
      setOpenModel(true);
    }
  }, [campaign, setDonate, setOpenModel]);

  const handleToggle = useCallback(() => onToggleHidden?.(id), [id, onToggleHidden]);
  const handleDelete = useCallback(() => onDelete?.(id), [id, onDelete]);
  const toggleExpand = useCallback(() => setExpanded(e => !e), []);

  return (
    <div className="cc-card">
      {/* Image */}
      <div className="cc-img-wrap">
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              className="cc-img"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              priority={priority}
            />
            <div className="cc-img-overlay" />
          </>
        ) : (
          <div className="cc-no-img">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>No image</span>
          </div>
        )}
        {isSample && <span className="cc-sample-badge">✦ Sample</span>}
        {category && !isSample && <span className="cc-cat-tag">{category}</span>}
        {isOwner && (
          <div className="cc-owner-btns">
            <button 
              className="cc-icon-btn cc-del-btn" 
              onClick={handleDelete}  
              title="Delete"
              aria-label="Delete campaign"
            >
              <IconTrash width={14} height={14} />
            </button>
            <button 
              className="cc-icon-btn cc-hide-btn" 
              onClick={handleToggle} 
              title="Hide"
              aria-label="Hide campaign"
            >
              <IconEyeOff width={14} height={14} />
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
            <button 
              className="cc-readmore" 
              onClick={toggleExpand}
              aria-expanded={expanded}
            >
              {expanded ? " Show less" : " Read more"}
            </button>
          )}
        </p>
        <div className="cc-progress-wrap">
          <div className="cc-progress-track">
            <div 
              className="cc-progress-bar" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="cc-progress-labels">
            <span className="cc-raised">
              <span className="cc-eth-icon">Ξ</span>
              {formattedAmountCollected} raised
            </span>
            <span className="cc-target">of Ξ {formattedTarget}</span>
          </div>
        </div>
        <div className="cc-meta">
          <div className="cc-meta-item">
            <div className="cc-meta-label">
              <IconClock width={10} height={10} /> Time Left
            </div>
            <div className="cc-meta-value">{remainingTime || "—"}</div>
          </div>
          <div className="cc-meta-item">
            <div className="cc-meta-label">
              <IconUser width={10} height={10} /> Owner
            </div>
            <div className="cc-meta-value" style={{ fontSize: 11 }}>
              {formattedOwner}
            </div>
          </div>
        </div>
      </div>

      <div className="cc-divider" />

      {!isSample && (
        <div className="cc-footer">
          <button 
            className="cc-donate-btn" 
            onClick={handleDonate}
            aria-label="Back this project"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Back This Project
          </button>
        </div>
      )}
    </div>
  );
});

Card.displayName = "Card";
export default Card;
