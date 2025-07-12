const hre = require("hardhat");
//0x5FbDB2315678afecb367f032d93F642f64180aa3;
async function main() {
  // Get the contract factory
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");

  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy(); // No need for parentheses

  await crowdFunding.waitForDeployment(); // ✅ Corrected method

  console.log(`CrowdFunding deployed at: ${await crowdFunding.getAddress()}`);
}

// Run the function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
