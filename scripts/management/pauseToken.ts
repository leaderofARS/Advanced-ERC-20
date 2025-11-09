import { ethers } from "hardhat";
import { AnalyticsHooks } from "../../typechain-types";

async function pauseToken(tokenAddress: string) {
  const [signer] = await ethers.getSigners();
  
  console.log("Connecting to token at:", tokenAddress);
  const token = await ethers.getContractAt("AnalyticsHooks", tokenAddress) as AnalyticsHooks;
  
  console.log("Current pause status:", await token.paused());
  
  if (await token.paused()) {
    console.log("Unpausing token...");
    const tx = await token.unpause();
    await tx.wait();
    console.log("Token unpaused successfully");
  } else {
    console.log("Pausing token...");
    const tx = await token.pause();
    await tx.wait();
    console.log("Token paused successfully");
  }
  
  console.log("New pause status:", await token.paused());
}

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS || "";
  
  if (!tokenAddress) {
    console.error("Please set TOKEN_ADDRESS environment variable");
    process.exit(1);
  }
  
  await pauseToken(tokenAddress);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { pauseToken };