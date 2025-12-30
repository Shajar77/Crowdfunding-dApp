import axios from "axios";

// Function to upload image to IPFS using Pinata
export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        }

      }
    );

    // If upload successful, return the IPFS URL
    return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Image upload failed");
  }
};
