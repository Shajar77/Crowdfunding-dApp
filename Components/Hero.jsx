import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="hero-video-section" id="hero" style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }}>
      <div className="hero-image-container" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        marginLeft: '2rem',
        pointerEvents: 'auto'
      }}>
        <h1 style={{ margin: 0 }}>
          <span className="hero-title-shimmer hero-title-mobile" style={{
            lineHeight: 0.85,
            fontWeight: 800,
            paddingRight: '0.15em'
          }}>
            Fundverse
          </span>
        </h1>
        
        <p className="hero-subtitle-tagline">
          A web3 crowdfunding dApp
        </p>
      </div>
    </section>
  );
};

export default React.memo(Hero);




