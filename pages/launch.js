import React, { useContext, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import PageShell from "../Components/PageShell";
import toast from "react-hot-toast";
import axios from "axios";

/* ── Inline SVG Icons for form ──────────────────────────────────── */
const IconEthereum = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 2l6 10-6 4-6-4 6-10z" />
    <path d="M6 12l6 4 6-4" />
    <path d="M12 16v6" />
  </svg>
);

const IconImage = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9" r="1.5" />
    <path d="M21 16l-5-5-5 5-3-3-5 5" />
  </svg>
);

const IconCheckCircle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </svg>
);

const IconMoney = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M7 9h.01M17 15h.01" />
  </svg>
);

const IconTitle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M4 6h16" />
    <path d="M9 6v12" />
    <path d="M15 6v12" />
  </svg>
);

const IconDate = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

const IconDescription = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M7 4h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M14 4v5h5" />
    <path d="M8 13h8M8 17h6" />
  </svg>
);

// Memoized Field component
const Field = React.memo(({
  icon: Icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  step,
  min
}) => (
  <div className="hf-field">
    <label className="hf-sr" htmlFor={`camp-${name}`}>{placeholder || name}</label>
    <div className={`hf-wrap ${error ? "hf-err" : ""} ${value ? "hf-filled" : ""}`}>
      <span className="hf-ico"><Icon /></span>
      <input
        className="hf-input"
        id={`camp-${name}`}
        aria-label={placeholder || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={min}
        autoComplete="off"
      />
      {value && !error && (
        <span className="hf-check"><IconCheckCircle /></span>
      )}
    </div>
    {error && (
      <p className="hf-errmsg">{error}</p>
    )}
  </div>
));
Field.displayName = 'Field';

/* ── Styles ──────────────────────────────────────────────────────── */
const launchStyles = `
  /* ── Overrides ────────────────────────────────────────── */
  .ps-inner { padding-top: 60px !important; }
  @media(min-width: 768px) { .ps-inner { padding-top: 80px !important; } }

  /* ── Page Layout: Split Top Area ──────────────────────── */
  .dn-top-wrap {
    display: grid; grid-template-columns: 1fr; gap: 40px; margin-bottom: 64px; align-items: center; width: 100%;
  }
  @media(min-width: 1024px) {
    .dn-top-wrap { grid-template-columns: 1fr 1fr; gap: 64px; }
  }

  .dn-left-header { width: 100%; max-width: 600px; margin: 0 auto; }
  .dn-page-title {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 800;
    letter-spacing: -0.04em; color: #022c22; line-height: 1.1;
    margin-bottom: 24px;
  }
  .dn-page-title em {
    font-style: normal;
    background: linear-gradient(110deg, #10b981, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .dn-page-desc {
    font-size: 18px; color: #5b6f66; line-height: 1.7; margin-bottom: 40px;
  }

  /* ── Refined Launch Form — Now smaller & better aligned ── */
  .lc-shell {
    position: relative; border-radius: 22px; overflow: hidden;
    background: #0b221a;
    box-shadow: 0 30px 60px rgba(2, 44, 34, 0.4);
    border: 1px solid rgba(16,185,129,0.18);
    width: 100%; max-width: 600px; margin: 0 auto;
  }
  .lc-panel { padding: 24px 20px; display: flex; flex-direction: column; }
  @media(min-width: 640px) { .lc-panel { padding: 32px; } }
  .lc-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .lc-title {
    font-family: var(--font-bricolage, "Bricolage Grotesque"), sans-serif;
    font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 4px;
  }
  .lc-title span { color: #10b981; }
  .lc-sub { font-size: 0.8rem; color: rgba(52,211,153,0.45); text-transform: uppercase; letter-spacing: 0.06em; }

  .lc-body { display: flex; flex-direction: column; gap: 16px; }

  /* ── Form Fields — Slightly Larger ─────────────────────── */
  .hf-field { display: flex; flex-direction: column; gap: 0; }
  .hf-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
  .hf-wrap {
    position: relative; display: flex; align-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: 12px; transition: all 0.2s ease;
  }
  .hf-wrap:focus-within {
    background: rgba(16,185,129,0.06); border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.12);
  }
  .hf-ico {
    padding-left: 14px; color: rgba(16,185,129,0.55); display: flex; align-items: center;
  }
  .hf-ico svg { width: 18px; height: 18px; }
  .hf-input {
    width: 100%; background: none; border: none; outline: none;
    padding: 13px 14px; font-size: 14px; color: #ecfdf5;
    font-family: 'Inter', sans-serif;
  }
  .hf-input::placeholder { color: rgba(167,243,208,0.28); }
  textarea.hf-input { height: 100px; resize: none; padding-top: 14px; }

  .hf-submit {
    width: 100%; padding: 15px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-size: 15px; font-weight: 700; margin-top: 10px;
    transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(16,185,129,0.3);
  }
  .hf-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }
  .hf-errmsg { font-size: 11.5px; color: #ef4444; margin-top: 4px; padding-left: 4px; }

  .lc-loading-bar {
    position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
    background: linear-gradient(90deg, #10b981, #059669, #047857);
    border-radius: 0 2px 2px 0;
    width: 80%;
  }
`;

const Launch = () => {
  const {
    currentAccount, createCampaign,
    connectWallet,
  } = useContext(CrowdFundingContext);

  // ── Launch Campaign Form State ─────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    image: null,
  });

  const isConnected = !!currentAccount;

  // Validation
  const validate = useCallback(() => {
    const newErrors = {};
    if (!campaign.title.trim()) newErrors.title = "Title is required";
    if (!campaign.description.trim()) newErrors.description = "Please describe your campaign";
    if (!campaign.amount || isNaN(campaign.amount) || +campaign.amount <= 0) newErrors.amount = "Enter a valid ETH amount";
    if (!campaign.deadline) newErrors.deadline = "Set a deadline";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [campaign]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCampaign(prev => ({ ...prev, image: file }));
    if (imgPreview) URL.revokeObjectURL(imgPreview);
    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  }, [imgPreview]);

  const uploadToIPFS = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          },
        }
      );
      toast.success("Pinned to IPFS ✨");
      return response.data.IpfsHash;
    } catch (error) {
      // IPFS upload failed:
      toast.error("IPFS upload failed.");
      return null;
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      let imageCid = null;
      if (campaign.image) {
        imageCid = await uploadToIPFS(campaign.image);
      }
      await createCampaign({ ...campaign, imageCid });
      toast.success("🚀 Campaign is live on-chain!");
      setCampaign({ title: "", description: "", amount: "", deadline: "", image: null });
      setImgPreview(null);
    } catch (error) {
      // Campaign launch failed:
      toast.error("Launch failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }, [campaign, validate, uploadToIPFS, createCampaign]);

  // Cleanup preview on unmount
  React.useEffect(() => {
    return () => { if (imgPreview) URL.revokeObjectURL(imgPreview); };
  }, [imgPreview]);

  return (
    <>
      <Head>
        <title>Launch Campaign — Fundverse</title>
        <meta name="description" content="Launch your crowdfunding campaign on Fundverse." />
      </Head>
      <style>{launchStyles}</style>

      <PageShell>
        {/* ── Split Top: Heading (Left) & Form (Right) ── */}
        <div className="dn-top-wrap">
          <div className="dn-left-header">
            <h1 className="dn-page-title">
              Launch Your Own<br /><em>Campaign</em>
            </h1>
            <p className="dn-page-desc">
              Have a visionary project? Turn your ideas into reality by connecting with our global community of backers. Deploy your campaign on-chain in minutes.
            </p>
          </div>

          <div className="dn-right-form">
            <div className="lc-shell">
              {isLoading && <div className="lc-loading-bar" />}
              <div className="lc-panel">
                <div className="lc-header">
                  <div className="lc-title">Launch <span>Campaign</span></div>
                  <div className="lc-sub">Deploy your vision to Web3</div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="lc-body">
                    <Field
                      icon={IconTitle}
                      name="title"
                      placeholder="Campaign Title"
                      value={campaign.title}
                      onChange={handleFormChange}
                      error={errors.title}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                      <Field
                        icon={IconMoney}
                        name="amount"
                        type="number"
                        placeholder="Target (ETH)"
                        value={campaign.amount}
                        onChange={handleFormChange}
                        error={errors.amount}
                        step="0.01"
                        min="0"
                      />
                      <Field
                        icon={IconDate}
                        name="deadline"
                        type="date"
                        placeholder="Deadline"
                        value={campaign.deadline}
                        onChange={handleFormChange}
                        error={errors.deadline}
                      />
                    </div>

                    <div className="hf-field">
                      <div className="hf-wrap" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('camp-img').click()}>
                        <span className="hf-ico"><IconImage /></span>
                        <div className="hf-input" style={{ color: campaign.image ? '#34d399' : 'rgba(167,243,208,0.25)', display: 'flex', alignItems: 'center' }}>
                          {campaign.image ? (campaign.image.name.length > 20 ? campaign.image.name.substring(0, 20) + "..." : campaign.image.name) : "Upload Cover Image"}
                        </div>
                        <input
                          id="camp-img"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="hf-field">
                      <div className={`hf-wrap ${errors.description ? "hf-err" : ""}`}>
                        <span className="hf-ico" style={{ alignSelf: 'flex-start', paddingTop: '16px' }}><IconDescription /></span>
                        <textarea
                          className="hf-input"
                          name="description"
                          placeholder="Project story..."
                          value={campaign.description}
                          onChange={handleFormChange}
                        />
                      </div>
                      {errors.description && <p className="hf-errmsg">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    {!isConnected ? (
                      <button
                        type="button"
                        className="hf-submit"
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="hf-submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Deploying..." : "Launch Campaign"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
};

export default Launch;
