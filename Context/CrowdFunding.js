import React, { createContext, useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
import { uploadToIPFS } from "@/utils/uploadToIPFS";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setCurrentAccount(address);
    } catch (error) {
      console.error("❌ Wallet connection error:", error);
    }
  };

  const createCampaign = async ({ title, description, amount, deadline, image }) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const target = ethers.parseEther(amount);
      const timestamp = Math.floor(new Date(deadline).getTime() / 1000);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadToIPFS(image);
      }

      const tx = await contract.createCampaign(
        await signer.getAddress(),
        title,
        description,
        imageUrl,
        target,
        timestamp
      );

      console.log("📤 Waiting for confirmation...");
      await tx.wait(); // Make sure it's mined before continuing
      console.log("✅ Campaign created:", tx.hash);

      return tx.hash; // Return something meaningful
    } catch (error) {
      console.error("❌ Campaign creation error:", error);
      throw error;
    }
  };


  const donate = async (campaignId, amount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const tx = await contract.donateToCampaign(campaignId, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      console.log("✅ Donation successful:", tx.hash);
    } catch (error) {
      console.error("❌ Donation failed:", error);
      throw new Error("Donation failed");
    }
  };

  const getCampaigns = async (includeHidden = false) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);

      const [
        owners,
        titles,
        descriptions,
        images,
        targets,
        deadlines,
        amountsCollected,
        isHiddens
      ] = await contract.getCampaigns();

      console.log("🛠 Raw campaigns data from contract:", {
        owners, titles, descriptions, images, targets, deadlines, amountsCollected, isHiddens
      });

      const allCampaigns = owners.map((_, i) => ({
        id: i,
        owner: owners[i],
        title: titles[i],
        description: descriptions[i],
        image: images[i],
        target: ethers.formatEther(targets[i]),
        deadline: deadlines[i],
        amountCollected: ethers.formatEther(amountsCollected[i]),
        isHidden: isHiddens[i],
      }));

      console.log("🛠 Formatted campaigns:", allCampaigns);

      const filtered = includeHidden
        ? allCampaigns
        : allCampaigns.filter((c) => !c.isHidden);

      setCampaigns(filtered);
      return filtered;
    } catch (error) {
      console.error("❌ Error getting campaigns:", error);
      return [];
    }
  };


  const getUserCampaigns = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = fetchContract(provider);

      const [
        owners,
        titles,
        descriptions,
        images,
        targets,
        deadlines,
        amountsCollected,
        isHiddens
      ] = await contract.getCampaigns();

      const userCampaigns = owners
        .map((_, i) => ({
          id: i,
          owner: owners[i],
          title: titles[i],
          description: descriptions[i],
          image: images[i], // include image
          target: ethers.formatEther(targets[i]),
          deadline: deadlines[i],
          amountCollected: ethers.formatEther(amountsCollected[i]),
          isHidden: isHiddens[i],
        }))
        .filter((c) => c.owner.toLowerCase() === address.toLowerCase());


      return userCampaigns;
    } catch (error) {
      console.error("❌ Error getting user campaigns:", error);
      return [];
    }
  };

  const toggleCampaignVisibility = async (campaignId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const tx = await contract.toggleHidden(campaignId);
      await tx.wait();
      console.log("✅ Visibility toggled:", tx.hash);

      await getCampaigns(); // Refresh state
    } catch (error) {
      console.error("❌ Toggle visibility error:", error);
      throw error;
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      // Not implemented on-chain
      console.warn("⚠️ Delete function is not implemented on-chain.");
      await getCampaigns(); // Just refresh list
    } catch (error) {
      console.error("❌ Error deleting campaign:", error);
      throw error;
    }
  };

  const getDonations = async (campaignId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);

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

  const checkIfWalletConnected = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    }
  };

  useEffect(() => {
    checkIfWalletConnected();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(accounts.length ? accounts[0] : "");
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <CrowdFundingContext.Provider
      value={{
        currentAccount,
        campaigns,
        connectWallet,
        getCampaigns,
        getUserCampaigns,
        createCampaign,
        donate,
        getDonations,
        toggleCampaignVisibility,
        deleteCampaign,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
