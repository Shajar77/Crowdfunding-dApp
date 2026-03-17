import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
// ethers is heavy - will be lazy loaded when needed
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
import { uploadToIPFS } from "@/utils/uploadToIPFS";

// Lazy load ethers to reduce initial bundle size
let ethers = null;
let cachedProvider = null;

const getEthers = async () => {
  if (!ethers) {
    ethers = await import("ethers");
  }
  return ethers;
};

const getProvider = async () => {
  if (typeof window === "undefined" || !window.ethereum) return null;
  if (!cachedProvider) {
    const { ethers } = await getEthers();
    cachedProvider = new ethers.BrowserProvider(window.ethereum);
  }
  return cachedProvider;
};

// Error boundary for context operations
const handleContextError = (error, operation) => {
  console.error(`❌ ${operation} error:`, error);
  // Could add error reporting service here
  return null;
};

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Optimized contract fetcher with caching
  const getContract = useCallback(async (withSigner = false) => {
    try {
      const { ethers } = await getEthers();
      const provider = await getProvider();
      if (!provider) return null;

      // Handle Read-Only (no signer)
      if (!withSigner) {
        return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);
      }

      // Handle Signer (requires wallet)
      const signer = await provider.getSigner();
      return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signer);
    } catch (error) {
      return handleContextError(error, "Contract fetch");
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Please install MetaMask or another Ethereum wallet.");
      }
      
      const Web3Modal = (await import("web3modal")).default;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const { ethers } = await getEthers();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setCurrentAccount(address);
      return address;
    } catch (error) {
      return handleContextError(error, "Wallet connection");
    }
  }, []);

  const createCampaign = useCallback(async ({ title, description, amount, deadline, image }) => {
    setIsLoading(true);
    try {
      if (!currentAccount) await connectWallet();
      const contract = await getContract(true);
      if (!contract) throw new Error("Contract not initialized with signer");

      const { ethers } = await getEthers();
      const target = ethers.parseEther(amount);
      const timestamp = Math.floor(new Date(deadline).getTime() / 1000);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadToIPFS(image);
      }

      const tx = await contract.createCampaign(
        currentAccount,
        title,
        description,
        imageUrl,
        target,
        timestamp
      );

      // Waiting for confirmation...
      const receipt = await tx.wait();
      // Campaign created:

      await getCampaigns();
      return receipt.hash;
    } catch (error) {
      throw handleContextError(error, "Campaign creation");
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount, connectWallet, getContract]);

  const donate = useCallback(async (campaignId, amount) => {
    setIsLoading(true);
    try {
      if (!currentAccount) await connectWallet();
      const contract = await getContract(true);
      if (!contract) throw new Error("Contract not initialized with signer");

      const { ethers } = await getEthers();
      const tx = await contract.donateToCampaign(campaignId, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      // Donation successful
      await getCampaigns();
    } catch (error) {
      throw handleContextError(error, "Donation");
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount, connectWallet, getContract]);

  const getCampaigns = useCallback(async () => {
    try {
      const contract = await getContract();
      if (!contract) return [];

      const rawCampaigns = await contract.getCampaigns();
      const { ethers } = await getEthers();
      
      const formattedCampaigns = rawCampaigns.map((campaign, i) => ({
        id: i,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        image: campaign.image,
        target: ethers.formatEther(campaign.target),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.formatEther(campaign.amountCollected),
        isHidden: campaign.isHidden,
      }));

      const filtered = formattedCampaigns.filter((c) => !c.isHidden);
      setCampaigns(filtered);
      return filtered;
    } catch (error) {
      console.warn("⚠️ Campaigns fetch skipped (likely provider connection issue):", error.message);
      return [];
    }
  }, [getContract]);

  const getUserCampaigns = useCallback(async () => {
    try {
      if (!currentAccount) return [];
      const allCampaigns = await getCampaigns();
      return allCampaigns.filter(
        (c) => c.owner.toLowerCase() === currentAccount.toLowerCase()
      );
    } catch (error) {
      return handleContextError(error, "Get user campaigns");
    }
  }, [currentAccount, getCampaigns]);

  const toggleCampaignVisibility = useCallback(async (campaignId) => {
    try {
      const contract = await getContract(true);
      if (!contract) return;

      const tx = await contract.toggleHidden(campaignId);
      await tx.wait();
      // Visibility toggled

      await getCampaigns();
    } catch (error) {
      throw handleContextError(error, "Toggle visibility");
    }
  }, [getContract, getCampaigns]);

  const getDonations = useCallback(async (campaignId) => {
    try {
      const contract = await getContract();
      if (!contract) return [];

      const [donators, donations] = await contract.getDonators(campaignId);
      const { ethers } = await getEthers();

      return donators.map((donor, i) => ({
        donor,
        amount: ethers.formatEther(donations[i]),
      }));
    } catch (error) {
      return handleContextError(error, "Get donations");
    }
  }, [getContract]);

  const checkIfWalletConnected = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      handleContextError(error, "Check wallet connection");
    }
  }, []);

  // Optimized event handling with proper cleanup
  useEffect(() => {
    checkIfWalletConnected();

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setCurrentAccount(accounts.length ? accounts[0] : "");
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkIfWalletConnected]);

  // Defer campaign fetch to reduce TBT - use requestIdleCallback or setTimeout
  useEffect(() => {
    // Wait for main thread to be idle before fetching campaigns
    const fetchCampaigns = () => getCampaigns();
    
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(fetchCampaigns, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(fetchCampaigns, 100);
      }
    }
  }, [getCampaigns]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentAccount,
    campaigns,
    isLoading,
    connectWallet,
    getCampaigns,
    getUserCampaigns,
    createCampaign,
    donate,
    getDonations,
    toggleCampaignVisibility,
  }), [currentAccount, campaigns, isLoading, connectWallet, getCampaigns, getUserCampaigns, createCampaign, donate, getDonations, toggleCampaignVisibility]);

  return (
    <CrowdFundingContext.Provider value={value}>
      {children}
    </CrowdFundingContext.Provider>
  );
};
