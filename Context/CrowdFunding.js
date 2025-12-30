import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
import { uploadToIPFS } from "@/utils/uploadToIPFS";

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  // Initialize Web3Modal once
  const web3Modal = useMemo(() => (typeof window !== "undefined" ? new Web3Modal() : null), []);

  // Optimized contract fetcher
  const getContract = useCallback(async (withSigner = false) => {
    try {
      // Check if we are in the browser
      if (typeof window === "undefined") return null;

      // Handle Read-Only (no signer)
      if (!withSigner) {
        // Use wallet provider if available
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);
        }

        // Fallback: Use a public RPC / Localhost for reading data if no wallet
        const fallbackProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, fallbackProvider);
      }

      // Handle Signer (requires wallet)
      if (!window.ethereum) {
        console.warn("⚠️ No Ethereum wallet detected for signing transactions.");
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signer);
    } catch (error) {
      console.error("❌ Error fetching contract:", error);
      return null;
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!web3Modal || typeof window === "undefined" || !window.ethereum) {
        alert("Please install MetaMask or another Ethereum wallet.");
        return;
      }
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setCurrentAccount(address);
      return address;
    } catch (error) {
      console.error("❌ Wallet connection error:", error);
    }
  };

  const createCampaign = async ({ title, description, amount, deadline, image }) => {
    try {
      if (!currentAccount) await connectWallet();
      const contract = await getContract(true);
      if (!contract) throw new Error("Contract not initialized with signer");

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

      console.log("📤 Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("✅ Campaign created:", receipt.hash);

      await getCampaigns();
      return receipt.hash;
    } catch (error) {
      console.error("❌ Campaign creation error:", error);
      throw error;
    }
  };

  const donate = async (campaignId, amount) => {
    try {
      if (!currentAccount) await connectWallet();
      const contract = await getContract(true);
      if (!contract) throw new Error("Contract not initialized with signer");

      const tx = await contract.donateToCampaign(campaignId, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      console.log("✅ Donation successful");
      await getCampaigns();
    } catch (error) {
      console.error("❌ Donation failed:", error);
      throw new Error("Donation failed");
    }
  };

  const getCampaigns = useCallback(async () => {
    try {
      const contract = await getContract();
      if (!contract) return [];

      const rawCampaigns = await contract.getCampaigns();

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

  const getUserCampaigns = async () => {
    try {
      if (!currentAccount) return [];
      const allCampaigns = await getCampaigns();
      return allCampaigns.filter(
        (c) => c.owner.toLowerCase() === currentAccount.toLowerCase()
      );
    } catch (error) {
      console.error("❌ Error getting user campaigns:", error);
      return [];
    }
  };

  const toggleCampaignVisibility = async (campaignId) => {
    try {
      const contract = await getContract(true);
      if (!contract) return;

      const tx = await contract.toggleHidden(campaignId);
      await tx.wait();
      console.log("✅ Visibility toggled");

      await getCampaigns();
    } catch (error) {
      console.error("❌ Toggle visibility error:", error);
      throw error;
    }
  };

  const getDonations = async (campaignId) => {
    try {
      const contract = await getContract();
      if (!contract) return [];

      const [donators, donations] = await contract.getDonators(campaignId);

      return donators.map((donor, i) => ({
        donor,
        amount: ethers.formatEther(donations[i]),
      }));
    } catch (error) {
      console.error("❌ Error fetching donations:", error);
      return [];
    }
  };

  const checkIfWalletConnected = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error("❌ Error checking wallet connection:", error);
    }
  }, []);

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
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkIfWalletConnected]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  const value = useMemo(() => ({
    currentAccount,
    campaigns,
    connectWallet,
    getCampaigns,
    getUserCampaigns,
    createCampaign,
    donate,
    getDonations,
    toggleCampaignVisibility,
  }), [currentAccount, campaigns, getCampaigns]);

  return (
    <CrowdFundingContext.Provider value={value}>
      {children}
    </CrowdFundingContext.Provider>
  );
};
