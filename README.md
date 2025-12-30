# Fundverse Decentralized Crowdfunding Platform

Fundverse is a decentralized crowdfunding application (dApp) built on the Ethereum blockchain. It allows users to create fundraising campaigns, set goals, and receive donations in ETH. The platform ensures transparency and security through smart contracts and decentralized storage.

## Features

- **Campaign Creation**: Users can launch campaigns with a title, description, target amount, and deadline.
- **Wallet Integration**: Secure connection via MetaMask using Web3Modal and Ethers.js.
- **ETH Donations**: Supporters can donate Ether directly to campaigns.
- **IPFS Integration**: Campaign images are stored on IPFS via Pinata for decentralized data persistence.
- **Real-time Updates**: View active campaigns and track funding progress in real-time.
- **Visibility Control**: Campaign owners can toggle the visibility of their campaigns.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, DaisyUI, Framer Motion.
- **Blockchain**: Solidity, Hardhat, Ethers.js.
- **Storage**: IPFS (Pinata).
- **Wallet Connection**: Web3Modal, MetaMask.

## Prerequisites

Before running the project, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MetaMask browser extension

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Crowdfunding-dApp-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Smart Contract Deployment

1. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```

2. In a new terminal, deploy the smart contract to the local network:
   ```bash
   npx hardhat run scripts/deployed.js --network localhost
   ```

3. Copy the deployed contract address from the terminal output and update it in `Context/contants.js`:
   ```javascript
   export const CrowdFundingAddress = "YOUR_DEPLOYED_ADDRESS";
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add your Pinata API credentials:

```env
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

3. Ensure your MetaMask is connected to the Hardhat local network:
   - Network Name: Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

## Project Structure

- `contracts/`: Solidity smart contracts.
- `scripts/`: Deployment scripts for Hardhat.
- `Context/`: React Context for blockchain state management and interaction.
- `Components/`: Reusable UI components.
- `pages/`: Next.js pages and routing.
- `utils/`: Utility functions for IPFS and other helpers.
- `styles/`: Global CSS and Tailwind configurations.

## License

This project is licensed under the MIT License.
