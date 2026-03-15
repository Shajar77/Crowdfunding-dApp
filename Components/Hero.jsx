import React, { useContext, useState, useCallback, useMemo } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import toast from "react-hot-toast";
import axios from "axios";

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

// Memoized Field component to prevent unnecessary re-renders
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
    <label className="hf-sr" htmlFor={name}>{placeholder || name}</label>
    <div className={`hf-wrap ${error ? "hf-err" : ""} ${value ? "hf-filled" : ""}`}>
      <span className="hf-ico"><Icon /></span>
      <input
        className="hf-input"
        id={name}
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

const Hero = ({ createCampaign }) => {
  const { currentAccount } = useContext(CrowdFundingContext);
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

  // Memoize USD conversion calculation
  const usdValue = useMemo(() => {
    const amount = parseFloat(campaign.amount) || 0;
    return (amount * 3200).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }, [campaign.amount]);

  // Optimized validation function
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!campaign.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!campaign.description.trim()) {
      newErrors.description = "Please describe your campaign";
    }
    if (!campaign.amount || isNaN(campaign.amount) || +campaign.amount <= 0) {
      newErrors.amount = "Enter a valid ETH amount";
    }
    if (!campaign.deadline) {
      newErrors.deadline = "Set a deadline";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [campaign]);

  // Optimized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  // Optimized image handler with cleanup
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCampaign(prev => ({ ...prev, image: file }));
    
    // Clean up previous preview
    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, [imgPreview]);

  // Optimized IPFS upload function
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
      console.error("IPFS upload failed:", error);
      toast.error("IPFS upload failed.");
      return null;
    }
  }, []);

  // Optimized submit handler
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
      
      // Reset form
      setCampaign({
        title: "",
        description: "",
        amount: "",
        deadline: "",
        image: null,
      });
      setImgPreview(null);
    } catch (error) {
      console.error("Campaign launch failed:", error);
      toast.error("Launch failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }, [campaign, validate, uploadToIPFS, createCampaign]);

  // Cleanup preview on unmount
  React.useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  return (
    <>
      {isLoading && <div className="h-bar-static" />}
      
      <section className="h-section">
        <div className="h-bg-base" />
        <div className="h-bg-grid" />
        <div className="h-bg-noise" />
        
        <div className="h-inner">
          {/* Left Section */}
          <div className="h-left">
            <div className="h-headline-wrap">
              <h1 className="h-headline">
                <span className="h-headline-plain">Turn Your Vision</span>
                <span className="h-headline-gradient">Into Reality.</span>
              </h1>
              <div className="h-tagline">
                Decentralized · Transparent · Borderless
              </div>
            </div>
            
            <p className="h-body">
              Launch campaigns on the <strong>Ethereum blockchain</strong>. Get backed by a global community — <em>transparent</em>, trustless, and completely borderless.
            </p>
          </div>

          {/* Right Section - Form */}
          <div className="h-right">
            <div className="hc-shell">
              <div className="hc-right">
                <div className="hc-right-header">
                  <div className="hc-right-title">Launch a <span>Campaign</span></div>
                  <div className="hc-right-sub">Fill in details to deploy on-chain</div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="hc-body">
                    {/* Title */}
                    <div className="hf-group">
                      <div className="hf-label">Campaign Title</div>
                      <Field
                        icon={IconTitle}
                        name="title"
                        placeholder="e.g. EcoChain: Reforestation DAO"
                        value={campaign.title}
                        onChange={handleChange}
                        error={errors.title}
                      />
                    </div>

                    {/* Description */}
                    <div className="hf-group">
                      <div className="hf-label">Description</div>
                      <div className="hf-textarea-wrap">
                        <span className="hf-textarea-ico"><IconDescription /></span>
                        <textarea
                          name="description"
                          value={campaign.description}
                          onChange={handleChange}
                          placeholder="What are you building? Why should people back it?"
                          className={`hf-textarea ${errors.description ? "hf-err" : ""}`}
                          rows={4}
                        />
                      </div>
                      {errors.description && (
                        <p className="hf-errmsg">{errors.description}</p>
                      )}
                    </div>

                    {/* Goal + Deadline */}
                    <div className="hf-row">
                      <div className="hf-group">
                        <div className="hf-label">Goal (ETH)</div>
                        <Field
                        icon={IconMoney}
                          name="amount"
                          type="number"
                          placeholder="0.00"
                          value={campaign.amount}
                          onChange={handleChange}
                          error={errors.amount}
                          step="0.01"
                        />
                        {campaign.amount && !errors.amount && (
                          <div className="hf-hint">
                            <IconEthereum width={10} height={10} /> ≈&nbsp;${usdValue}
                          </div>
                        )}
                      </div>
                      
                      <div className="hf-group">
                        <div className="hf-label">Deadline</div>
                        <Field
                        icon={IconDate}
                          name="deadline"
                          type="date"
                          value={campaign.deadline}
                          onChange={handleChange}
                          error={errors.deadline}
                        />
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="hf-group">
                      <div className="hf-label">Cover Image</div>
                      <label className="hf-upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <div className="hf-upload-ico"><IconImage width={14} height={14} /></div>
                        <div className="hf-upload-texts">
                          <div className="hf-upload-head">
                            {campaign.image ? campaign.image.name : "Click to upload"}
                          </div>
                          <div className="hf-upload-sub">
                            {campaign.image ? "Change image" : "PNG, JPG — pinned to IPFS"}
                          </div>
                        </div>
                        {imgPreview && (
                          <img 
                            src={imgPreview} 
                            alt="Preview" 
                            className="hf-upload-thumb" 
                            width="26" 
                            height="26" 
                          />
                        )}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="hf-submit" 
                      disabled={isLoading}
                    >
                      <span className="hf-submit-inner">
                        {isLoading ? (
                          <>
                            <div className="h-spin" />
                            &nbsp;Deploying to Ethereum
                          </>
                        ) : (
                          "Launch Campaign"
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="hc-foot">
                  <div className="hc-foot-item">
                    <IconShield width={10} height={10} /> Audited
                  </div>
                  <div className="hc-foot-sep" />
                  <div className="hc-foot-item">
                    <IconCheckCircle width={10} height={10} /> Non-custodial
                  </div>
                  <div className="hc-foot-sep" />
                  <div className="hc-foot-item">
                    <IconEthereum width={10} height={10} /> 0% Fee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default React.memo(Hero);
