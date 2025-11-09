import { ethers, upgrades } from "hardhat";

async function upgradeContract(proxyAddress: string, newImplementationName: string) {
  console.log("Upgrading contract...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading with account:", deployer.address);

  // Get the new implementation contract factory
  const NewImplementation = await ethers.getContractFactory(newImplementationName);
  
  // Upgrade the proxy to the new implementation
  const upgraded = await upgrades.upgradeProxy(proxyAddress, NewImplementation);
  await upgraded.waitForDeployment();
  
  const upgradedAddress = await upgraded.getAddress();
  console.log("Contract upgraded successfully");
  console.log("Proxy address:", upgradedAddress);
  
  return upgraded;
}

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS || "";
  const newImplementation = process.env.NEW_IMPLEMENTATION || "AnalyticsHooks";

  if (!proxyAddress) {
    console.error("Please set PROXY_ADDRESS environment variable");
    process.exit(1);
  }

  await upgradeContract(proxyAddress, newImplementation);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { upgradeContract };