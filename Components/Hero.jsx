import React, { useContext, useState, useEffect, useRef } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWallet, FaRocket, FaEthereum, FaUsers, FaFire,
  FaImage, FaExternalLinkAlt, FaArrowRight, FaShieldAlt, FaCheckCircle
} from "react-icons/fa";
import {
  MdCampaign, MdAttachMoney, MdTitle, MdDateRange, MdDescription, MdVerified
} from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import axios from "axios";



/* ─── Form Field ────────────────────────────────────────────────────────── */
const Field = ({ icon: Icon, name, type = "text", placeholder, value, onChange, error, step, min }) => (
  <div className="hf-field">
    <div className={`hf-wrap ${error ? "hf-err" : ""} ${value ? "hf-filled" : ""}`}>
      <span className="hf-ico"><Icon /></span>
      <input
        className="hf-input"
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        step={step} min={min} autoComplete="off"
      />
      {value && !error && (
        <span className="hf-check"><FaCheckCircle /></span>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p className="hf-errmsg"
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Floating Particle ─────────────────────────────────────────────────── */
const Particle = React.memo(({ style }) => (
  <div className="h-particle" style={style} />
));

/* ─── Particles data ─────────────────────────────────────────────── */
const PARTICLES = [
  { width: 3, height: 3, top: "12%", left: "8%", opacity: 0.6, animDuration: "6s", animDelay: "0s", color: "#10b981" },
  { width: 2, height: 2, top: "28%", left: "18%", opacity: 0.4, animDuration: "8s", animDelay: "1s", color: "#34d399" },
  { width: 4, height: 4, top: "65%", left: "5%", opacity: 0.5, animDuration: "7s", animDelay: "2s", color: "#22c55e" },
  { width: 2, height: 2, top: "80%", left: "25%", opacity: 0.35, animDuration: "9s", animDelay: "0.5s", color: "#ffffff" },
  { width: 3, height: 3, top: "45%", left: "92%", opacity: 0.5, animDuration: "7.5s", animDelay: "1.5s", color: "#10b981" },
  { width: 2, height: 2, top: "15%", left: "85%", opacity: 0.4, animDuration: "10s", animDelay: "3s", color: "#34d399" },
  { width: 5, height: 5, top: "70%", left: "78%", opacity: 0.3, animDuration: "8.5s", animDelay: "2.5s", color: "#22c55e" },
  { width: 2, height: 2, top: "92%", left: "60%", opacity: 0.45, animDuration: "6.5s", animDelay: "4s", color: "#ffffff" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
const Hero = ({ createCampaign }) => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const [campaign, setCampaign] = useState({
    title: "", description: "", amount: "", deadline: "", image: null,
  });

  const cardRef = useRef(null);

  const usd = ((parseFloat(campaign.amount) || 0) * 3200).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  const validate = () => {
    const e = {};
    if (!campaign.title.trim()) e.title = "Title is required";
    if (!campaign.description.trim()) e.description = "Please describe your campaign";
    if (!campaign.amount || isNaN(campaign.amount) || +campaign.amount <= 0) e.amount = "Enter a valid ETH amount";
    if (!campaign.deadline) e.deadline = "Set a deadline";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onChange = (e) => {
    setCampaign(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: null }));
  };

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCampaign(p => ({ ...p, image: file }));
    const r = new FileReader();
    r.onloadend = () => setImgPreview(r.result);
    r.readAsDataURL(file);
  };

  const pinata = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        },
      });
      toast.success("Pinned to IPFS ✨");
      return res.data.IpfsHash;
    } catch { toast.error("IPFS upload failed."); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      let imageCid = null;
      if (campaign.image) imageCid = await pinata(campaign.image);
      await createCampaign({ ...campaign, imageCid });
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 200, spread: 110, origin: { y: 0.55 }, colors: ["#00f5a0", "#00d9f5", "#a855f7", "#f59e0b"] });
      toast.success("🚀 Campaign is live on-chain!");
      setCampaign({ title: "", description: "", amount: "", deadline: "", image: null });
      setImgPreview(null);
    } catch { toast.error("Launch failed. Try again."); }
    finally { setIsLoading(false); }
  };

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Injected CSS ──────────────────────────────────────────────── */}
      <style>{`

        /* reset */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Section shell ───────────────────────────────────────────── */
        .h-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 20px 60px;
          background: linear-gradient(160deg, #f0fdf4 0%, #dcfce7 35%, #ffffff 60%, #f0fdf4 100%);
          font-family: 'Inter', sans-serif;
        }
        @media(min-width: 1024px) {
          .h-section { padding: 120px 40px 100px; }
        }

        /* ── Deep base gradient ──────────────────────────────────────── */
        .h-bg-base {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(160deg,
            rgba(240,253,244,0.95) 0%,
            rgba(220,252,231,0.9) 35%,
            rgba(255,255,255,0.92) 60%,
            rgba(240,253,244,0.95) 100%
          );
          background-size: 220% 220%;
          animation: gradientFlow 16s ease infinite;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Moving Aurora sweep ─────────────────────────────────────── */
        .h-bg-aurora {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          overflow: hidden;
        }
        .h-bg-aurora::before {
          content: '';
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background: conic-gradient(
            from 0deg at 50% 40%,
            transparent 0deg,
            rgba(16,185,129,0.06) 40deg,
            rgba(255,255,255,0.05) 80deg,
            rgba(52,211,153,0.06) 130deg,
            transparent 180deg,
            rgba(34,197,94,0.05) 240deg,
            rgba(255,255,255,0.04) 290deg,
            transparent 360deg
          );
          animation: auroraSpin 28s linear infinite;
        }
        .h-bg-aurora::after {
          content: '';
          position: absolute;
          width: 180%; height: 180%;
          top: -40%; left: -40%;
          background: conic-gradient(
            from 180deg at 50% 60%,
            transparent 0deg,
            rgba(255,255,255,0.03) 60deg,
            rgba(16,185,129,0.05) 110deg,
            rgba(52,211,153,0.04) 180deg,
            transparent 240deg,
            rgba(34,197,94,0.05) 310deg,
            transparent 360deg
          );
          animation: auroraSpin 38s linear infinite reverse;
        }
        @keyframes auroraSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Scanning beam ───────────────────────────────────────────── */
        .h-bg-beam {
          position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden;
        }
        .h-bg-beam::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(16,185,129,0.05) 40%,
            rgba(255,255,255,0.07) 50%,
            rgba(52,211,153,0.05) 60%,
            transparent 100%
          );
          animation: scanBeam 9s ease-in-out infinite;
        }
        @keyframes scanBeam {
          0%   { left: -100%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 140%; opacity: 0; }
        }

        /* ── Noise texture ───────────────────────────────────────────── */
        .h-bg-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E");
          background-size: 256px;
          z-index: 3; pointer-events: none;
        }

        /* ── Grid lines ─────────────────────────────────────────────── */
        .h-bg-grid {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          background-image:
            linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, #000 0%, #000 40%, transparent 85%);
        }

        /* ── Grid intersect glows ────────────────────────────────────── */
        .h-bg-grid-glow {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background-image:
            radial-gradient(circle 1.5px at 0 0, rgba(16,185,129,0.35) 0%, transparent 100%),
            radial-gradient(circle 1.5px at 0 0, rgba(255,255,255,0.3) 0%, transparent 100%);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 0%, transparent 80%);
          animation: gridGlowPulse 4s ease-in-out infinite alternate;
        }
        @keyframes gridGlowPulse {
          0%   { opacity: 0.6; }
          100% { opacity: 1; }
        }

        /* ── Floating Particles ──────────────────────────────────────── */
        .h-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
          animation: particleFloat var(--dur) ease-in-out var(--delay) infinite alternate;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: var(--op); }
          33%  { transform: translateY(-18px) translateX(8px) scale(1.3); }
          66%  { transform: translateY(-8px) translateX(-12px) scale(0.8); }
          100% { transform: translateY(-24px) translateX(4px) scale(1.1); opacity: calc(var(--op) * 0.5); }
        }

        /* ── Orbs (ambient glow) ─────────────────────────────────────── */
        .h-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; z-index: 6;
          animation: orbDrift 20s ease-in-out infinite alternate;
        }
        .h-orb-1 {
          width: 900px; height: 700px; top: -280px; left: -180px;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.08) 40%, transparent 70%);
          filter: blur(55px);
          animation-duration: 18s;
        }
        .h-orb-2 {
          width: 700px; height: 600px; bottom: -180px; right: -140px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(34,211,153,0.1) 40%, transparent 70%);
          filter: blur(60px);
          animation-duration: 24s; animation-delay: -6s;
        }
        .h-orb-3 {
          width: 520px; height: 520px; top: 28%; left: 38%;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.05) 40%, transparent 70%);
          filter: blur(70px);
          animation-duration: 16s; animation-delay: -11s;
        }
        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(28px, -18px) scale(1.06); }
          100% { transform: translate(-18px, 28px) scale(0.94); }
        }

        /* ── Layout ─────────────────────────────────────────────────── */
        .h-inner {
          position: relative; z-index: 10;
          max-width: 100%; width: 100%;
          display: flex; flex-direction: column; gap: 40px;
          text-align: center;
        }
        @media(min-width:1024px) {
          .h-inner { flex-direction: row; align-items: center; justify-content: space-between; gap: 80px; text-align: left; }
        }

        /* ═══════════════ LEFT COLUMN ════════════════════════════════ */
        .h-left { flex: 1.2; display: flex; flex-direction: column; }

        /* ── Badge ───────────────────────────────────────────────────── */


        /* ── Headline ───────────────────────────────────────────────── */
        .h-headline-wrap { margin-bottom: 8px; }
        .h-headline {
          font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.04em;
          color: #064e3b;
          margin-bottom: 0;
        }
        .h-headline-plain { display: block; }
        .h-headline-gradient {
          display: block;
          background: linear-gradient(110deg, #064e3b 0%, #047857 40%, #059669 80%, #10b981 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          padding-bottom: 4px;
        }

        /* ── Tagline ─────────────────────────────────────────────────── */
        .h-tagline {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: #065f46;
          margin-top: 10px; margin-bottom: 28px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        @media(min-width: 1024px) {
          .h-tagline { justify-content: flex-start; font-size: 0.78rem; }
        }
        .h-tagline::before, .h-tagline::after {
          content: ''; flex: 1; max-width: 30px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6,95,70,0.5));
        }
        @media(min-width: 1024px) {
          .h-tagline::before { display: none; }
          .h-tagline::after { max-width: 40px; }
        }
        .h-tagline::after { background: linear-gradient(90deg, rgba(6,95,70,0.5), transparent); }

        /* Body */
        .h-body {
          font-size: 1rem; line-height: 1.7;
          color: #047857; max-width: 100%;
          margin-bottom: 30px; font-weight: 400;
        }
        @media(min-width: 1024px) {
          .h-body { font-size: 1.08rem; line-height: 1.8; max-width: 480px; margin-bottom: 40px; }
        }
        .h-body strong { color: #065f46; font-weight: 600; }
        .h-body em { color: #10b981; font-style: normal; font-weight: 500; }

        /* CTAs */
        .h-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 52px; }

        .h-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 16px; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.94rem; font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none; letter-spacing: -0.015em;
          box-shadow: 0 0 0 0 rgba(16,185,129,0);
          transition: all 0.3s cubic-bezier(.22,1,.36,1);
          text-decoration: none; position: relative; overflow: hidden;
        }
        .h-btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #34d399 0%, #047857 100%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .h-btn-primary:hover::before { opacity: 1; }
        .h-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 40px rgba(16,185,129,0.4), 0 12px 32px rgba(0,0,0,0.5);
        }
        .h-btn-primary span { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }

        .h-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 30px; border-radius: 16px; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.94rem; font-weight: 600;
          color: #065f46;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(16,185,129,0.3);
          letter-spacing: -0.01em;
          transition: all 0.25s ease;
          text-decoration: none; backdrop-filter: blur(8px);
        }
        .h-btn-ghost:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(16,185,129,0.5);
          color: #047857; transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .h-wallet-badge {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 22px; border-radius: 16px;
          background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1));
          border: 1px solid rgba(16,185,129,0.3);
          color: #065f46; font-family: 'Courier New', monospace;
          font-size: 0.86rem; font-weight: 600;
          backdrop-filter: blur(8px);
        }



        /* ═══════════════ RIGHT COLUMN — split card ════════════════ */
        .h-right { flex: 1.1; width: 100%; max-width: 480px; margin: 0; }

        /* ─────────────────────────────────────────────────────────────
           SPLIT CARD SHELL
        ───────────────────────────────────────────────────────────── */
        @property --spin {
          syntax: '<angle>'; initial-value: 0deg; inherits: false;
        }
        @keyframes spinTrace { to { --spin: 360deg; } }

        .hc-shell {
          position: relative;
          display: flex;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(16,185,129,0.2),
            0 25px 80px -15px rgba(0,0,0,0.7),
            0 0 60px -25px rgba(16,185,129,0.12);
          transition: box-shadow 0.5s ease;
        }
        .hc-shell:hover {
          box-shadow:
            0 0 0 1px rgba(16,185,129,0.4),
            0 35px 90px -15px rgba(0,0,0,0.8),
            0 0 80px -20px rgba(16,185,129,0.15);
        }
        /* Spinning neon trace border */
        .hc-shell::before {
          content: '';
          position: absolute; inset: -1px; border-radius: 25px;
          background: conic-gradient(
            from var(--spin),
            transparent 0deg, rgba(16,185,129,0.8) 45deg,
            rgba(5,150,105,0.5) 70deg, transparent 110deg
          );
          animation: spinTrace 4s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 1px; pointer-events: none; z-index: 3;
        }

        /* ── LEFT PANEL — premium emerald brand panel ─────────────── */


        /* ── RIGHT PANEL — dark premium form ──────────────────────── */
        .hc-right {
          flex: 1;
          position: relative;
          background:
            radial-gradient(ellipse 80% 60% at 100% 0%, rgba(16,185,129,0.1) 0%, transparent 55%),
            #11291f;
          padding: 26px 24px 20px;
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        /* Subtle corner accent line */
        .hc-right::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent);
          pointer-events: none;
        }

        /* Header */
        .hc-right-header {
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hc-right-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.1rem; font-weight: 900;
          color: #fff;
          letter-spacing: -0.025em; line-height: 1.1;
          margin-bottom: 5px;
        }
        .hc-right-title span {
          background: linear-gradient(90deg, #10b981, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hc-right-sub {
          font-size: 0.68rem; color: rgba(52,211,153,0.45);
          display: flex; align-items: center; gap: 6px;
        }
        .hc-right-sub::before {
          content: '';
          width: 18px; height: 1px;
          background: rgba(52,211,153,0.3);
          flex-shrink: 0;
        }

        /* Form body */
        .hc-body {
          display: flex; flex-direction: column; gap: 12px;
          flex: 1;
        }
        .hf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hf-group { display: flex; flex-direction: column; }

        /* ── Minimal underline input style ─────────────────────── */
        .hf-label {
          font-size: 0.55rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(52,211,153,0.45);
          margin-bottom: 1px;
        }
        .hf-wrap {
          position: relative; display: flex; align-items: center;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          border-radius: 0;
          transition: border-color 0.25s ease;
          padding-bottom: 1px;
        }
        .hf-wrap::before {
          content: '';
          position: absolute; bottom: -1px; left: 0;
          width: 0%; height: 2px;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.4s cubic-bezier(0.19,1,0.22,1);
          border-radius: 2px;
        }
        .hf-wrap:focus-within::before { width: 100%; }
        .hf-wrap:focus-within { border-color: transparent; }
        .hf-wrap.hf-err { border-color: rgba(248,113,113,0.35); }
        .hf-wrap.hf-err::before { background: #f87171; width: 100%; }

        .hf-ico {
          color: rgba(52,211,153,0.25); font-size: 0.82rem;
          flex-shrink: 0; margin-right: 8px;
          transition: color 0.25s;
        }
        .hf-wrap:focus-within .hf-ico { color: rgba(52,211,153,0.7); }

        .hf-input {
          width: 100%; padding: 9px 28px 9px 0;
          background: transparent; border: none; outline: none;
          color: #ecfdf5; font-size: 0.87rem; font-weight: 400;
          font-family: 'Inter', sans-serif; letter-spacing: 0.01em;
        }
        .hf-input::placeholder { color: rgba(255,255,255,0.15); font-weight: 300; }
        .hf-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5) hue-rotate(120deg); cursor: pointer; opacity: 0.4; }

        .hf-check {
          position: absolute; right: 0;
          color: #10b981; font-size: 0.75rem;
          animation: popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0) rotate(-30deg); }
          to   { opacity: 1; transform: scale(1) rotate(0); }
        }
        .hf-errmsg {
          font-size: 0.6rem; color: rgba(252,165,165,0.9); font-weight: 600;
          margin-top: 3px; display: flex; align-items: center; gap: 3px;
        }

        /* ── Textarea — minimal underline ─────────────────────── */
        .hf-textarea-wrap {
          position: relative; display: flex; align-items: flex-start;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.25s;
        }
        .hf-textarea-wrap::after {
          content: '';
          position: absolute; bottom: -1px; left: 0;
          width: 0%; height: 2px;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.4s cubic-bezier(0.19,1,0.22,1);
          border-radius: 2px;
        }
        .hf-textarea-wrap:focus-within::after { width: 100%; }
        .hf-textarea-wrap:focus-within { border-color: transparent; }
        .hf-textarea-ico {
          color: rgba(52,211,153,0.25); font-size: 0.82rem;
          flex-shrink: 0; margin-right: 8px; margin-top: 10px;
          pointer-events: none; transition: color 0.25s;
        }
        .hf-textarea-wrap:focus-within .hf-textarea-ico { color: rgba(52,211,153,0.7); }
        .hf-textarea {
          flex: 1; padding: 9px 0;
          background: transparent; border: none; outline: none; resize: none;
          color: #ecfdf5; font-family: 'Inter', sans-serif;
          font-size: 0.87rem; height: 52px; letter-spacing: 0.01em;
        }
        .hf-textarea::placeholder { color: rgba(255,255,255,0.15); font-weight: 300; }

        /* ── ETH hint ──────────────────────────────────────────── */
        .hf-hint {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 99px; margin-top: 3px;
          font-size: 0.6rem; font-weight: 700; color: #34d399;
          background: rgba(16,185,129,0.07);
          border: 1px solid rgba(16,185,129,0.12);
        }

        /* ── Upload Zone ─────────────────────────────────────────── */
        .hf-upload {
          cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(16,185,129,0.18);
          transition: all 0.25s ease;
        }
        .hf-upload:hover {
          border-color: rgba(16,185,129,0.4);
          background: rgba(16,185,129,0.04);
        }
        .hf-upload input[type="file"] { display: none; }
        .hf-upload-ico {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; color: #34d399;
        }
        .hf-upload-head { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.75); }
        .hf-upload-sub  { font-size: 0.6rem; color: rgba(52,211,153,0.35); margin-top: 1px; }
        .hf-upload-thumb {
          margin-left: auto; width: 26px; height: 26px; border-radius: 6px;
          object-fit: cover; border: 1.5px solid rgba(16,185,129,0.4);
        }

        /* ── Launch Button — full-width, no icon ────────────────── */
        .hf-submit {
          position: relative; overflow: hidden;
          width: 100%; border: none; border-radius: 10px; cursor: pointer;
          margin-top: 4px; padding: 0;
          background: linear-gradient(105deg, #059669 0%, #10b981 35%, #34d399 65%, #6ee7b7 100%);
          background-size: 210% 100%; background-position: 0% center;
          box-shadow:
            0 0 0 1px rgba(16,185,129,0.35),
            0 6px 20px rgba(16,185,129,0.28),
            inset 0 1px 0 rgba(255,255,255,0.18);
          transition: background-position 0.55s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }
        .hf-submit:hover {
          background-position: 100% center;
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px rgba(52,211,153,0.5),
            0 12px 32px rgba(16,185,129,0.45),
            0 0 0 4px rgba(16,185,129,0.08);
        }
        .hf-submit:active { transform: translateY(0px); }
        .hf-submit:disabled {
          opacity: 0.4; cursor: not-allowed;
          transform: none; filter: saturate(0.2); box-shadow: none;
        }
        .hf-submit-inner {
          display: flex; align-items: center; justify-content: center;
          padding: 14px 24px;
          font-size: 0.82rem; font-weight: 900;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #022c22; font-family: 'Bricolage Grotesque', sans-serif;
          position: relative; z-index: 1;
        }


        /* ── Footer trust bar ──────────────────────────────────── */
        .hc-foot {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          margin-top: 12px; padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .hc-foot-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em;
          color: rgba(167,243,208,0.3); text-transform: uppercase;
        }
        .hc-foot-item svg { color: rgba(16,185,129,0.4); }
        .hc-foot-sep {
          width: 2px; height: 2px; border-radius: 50%;
          background: rgba(16,185,129,0.15);
        }

        /* ── Spinner ─────────────────────────────────────────────── */
        .h-spin {
          width: 17px; height: 17px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Top loading bar */
        .h-bar {
          position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
          background: linear-gradient(90deg, #10b981, #059669, #047857);
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 12px rgba(16,185,129,0.6);
        }

        /* Scroll cue */
        .h-scroll-cue {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 10; animation: scrollCue 2.4s ease-in-out infinite;
        }
        .h-scroll-cue-label {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: #065f46; opacity: 0.8;
        }
        .h-scroll-cue-mouse {
          width: 20px; height: 30px; border-radius: 10px;
          border: 1.5px solid rgba(16,185,129,0.3);
          display: flex; justify-content: center; padding-top: 6px;
        }
        .h-scroll-cue-wheel {
          width: 3px; height: 7px; border-radius: 2px;
          background: linear-gradient(to bottom, #10b981, transparent);
          animation: wheelScroll 1.8s ease-in-out infinite;
        }
        @keyframes wheelScroll {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(6px); opacity: 0; }
        }
        @keyframes scrollCue {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>

      {/* ── Loading bar ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div className="h-bar"
            initial={{ width: "0%" }} animate={{ width: "88%" }} exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      <section className="h-section">

        {/* Backgrounds */}
        <div className="h-bg-base" />
        <div className="h-bg-aurora" />
        <div className="h-bg-beam" />
        <div className="h-bg-noise" />
        <div className="h-bg-grid" />
        <div className="h-bg-grid-glow" />
        <div className="h-orb h-orb-1" />
        <div className="h-orb h-orb-2" />
        <div className="h-orb h-orb-3" />

        {/* Floating Particles */}
        {PARTICLES.map((p, i) => (
          <Particle key={i} style={{
            width: p.width, height: p.height,
            top: p.top, left: p.left,
            background: p.color,
            boxShadow: `0 0 ${p.width * 3}px ${p.color}`,
            "--op": p.opacity,
            "--dur": p.animDuration,
            "--delay": p.animDelay,
          }} />
        ))}

        <div className="h-inner">

          {/* ══════════════════ LEFT ══════════════════════════════════════ */}
          <motion.div className="h-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >


            {/* Headline */}
            <div className="h-headline-wrap">
              <motion.h1 className="h-headline"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="h-headline-plain">Turn Your Vision</span>
                <span className="h-headline-gradient">Into Reality.</span>
              </motion.h1>

              <motion.div className="h-tagline"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Decentralized · Transparent · Borderless
              </motion.div>
            </div>

            {/* Body */}
            <motion.p className="h-body"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.7 }}
            >
              Launch campaigns on the <strong>Ethereum blockchain</strong>. Get backed by a global community — <em>transparent</em>, trustless, and completely borderless.
            </motion.p>

            {/* CTAs removed per request */}
          </motion.div>

          {/* ══════════════════ RIGHT / FORM ══════════════════════════════ */}
          <motion.div className="h-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hc-shell" ref={cardRef} onMouseMove={handleMouseMove}>




              {/* ══ RIGHT PANEL — the form ══ */}
              <div className="hc-right">
                <div className="hc-right-header">
                  <div className="hc-right-title">Launch a <span>Campaign</span></div>
                  <div className="hc-right-sub">Fill in details to deploy on-chain</div>
                </div>

                <form onSubmit={onSubmit}>
                  <div className="hc-body">

                    {/* Title */}
                    <div className="hf-group">
                      <div className="hf-label">Campaign Title</div>
                      <motion.div animate={errors.title ? { x: [-5, 5, -4, 4, 0] } : {}} transition={{ duration: 0.28 }}>
                        <Field icon={MdTitle} name="title" placeholder="e.g. EcoChain: Reforestation DAO" value={campaign.title} onChange={onChange} error={errors.title} />
                      </motion.div>
                    </div>

                    {/* Description */}
                    <div className="hf-group">
                      <div className="hf-label">Description</div>
                      <motion.div animate={errors.description ? { x: [-5, 5, -4, 4, 0] } : {}} transition={{ duration: 0.28 }}>
                        <div className="hf-textarea-wrap">
                          <span className="hf-textarea-ico"><MdDescription /></span>
                          <textarea name="description" value={campaign.description} onChange={onChange}
                            placeholder="What are you building? Why should people back it?"
                            className={`hf-textarea ${errors.description ? "hf-err" : ""}`}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.description && (
                            <motion.p className="hf-errmsg" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors.description}</motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Goal + Deadline */}
                    <div className="hf-row">
                      <div className="hf-group">
                        <div className="hf-label">Goal (ETH)</div>
                        <motion.div animate={errors.amount ? { x: [-5, 5, -4, 4, 0] } : {}} transition={{ duration: 0.28 }}>
                          <Field icon={MdAttachMoney} name="amount" type="number" placeholder="0.00" value={campaign.amount} onChange={onChange} error={errors.amount} step="0.01" />
                        </motion.div>
                        <AnimatePresence>
                          {campaign.amount && !errors.amount && (
                            <motion.div className="hf-hint" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                              <FaEthereum size={8} /> ≈&nbsp;${usd}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="hf-group">
                        <div className="hf-label">Deadline</div>
                        <motion.div animate={errors.deadline ? { x: [-5, 5, -4, 4, 0] } : {}} transition={{ duration: 0.28 }}>
                          <Field icon={MdDateRange} name="deadline" type="date" value={campaign.deadline} onChange={onChange} error={errors.deadline} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="hf-group">
                      <div className="hf-label">Cover Image</div>
                      <label className="hf-upload">
                        <input type="file" accept="image/*" onChange={onImage} />
                        <div className="hf-upload-ico"><FaImage /></div>
                        <div className="hf-upload-texts">
                          <div className="hf-upload-head">{campaign.image ? campaign.image.name : "Click to upload"}</div>
                          <div className="hf-upload-sub">{campaign.image ? "Change image" : "PNG, JPG — pinned to IPFS"}</div>
                        </div>
                        {imgPreview && <img src={imgPreview} alt="Preview" className="hf-upload-thumb" />}
                      </label>
                    </div>

                    {/* Submit */}
                    <motion.button type="submit" className="hf-submit" disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.01 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      <span className="hf-submit-inner">
                        {isLoading ? <><div className="h-spin" />&nbsp;Deploying to Ethereum</> : <>Launch Campaign</>}
                      </span>
                    </motion.button>

                  </div>
                </form>

                <div className="hc-foot">
                  <div className="hc-foot-item"><FaShieldAlt size={9} /> Audited</div>
                  <div className="hc-foot-sep" />
                  <div className="hc-foot-item"><FaCheckCircle size={9} /> Non-custodial</div>
                  <div className="hc-foot-sep" />
                  <div className="hc-foot-item"><FaEthereum size={9} /> 0% Fee</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Scroll cue */}
        <div className="h-scroll-cue">
          <span className="h-scroll-cue-label">Scroll</span>
          <div className="h-scroll-cue-mouse">
            <div className="h-scroll-cue-wheel" />
          </div>
        </div>

      </section>
    </>
  );
};

export default Hero;
