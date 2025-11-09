import { ethers } from "hardhat";
import { AnalyticsHooks } from "../../typechain-types";

async function mintTokens(tokenAddress: string, recipient: string, amount: string) {
  const [signer] = await ethers.getSigners();
  
  console.log("Connecting to token at:", tokenAddress);
  const token = await ethers.getContractAt("AnalyticsHooks", tokenAddress) as AnalyticsHooks;
  
  const mintAmount = ethers.parseEther(amount);
  
  console.log("Minting", amount, "tokens to:", recipient);
  console.log("Current total supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Max supply:", ethers.formatEther(await token.maxSupply()));
  
  // Check if minter has the required role
  const MINTER_ROLE = await token.MINTER_ROLE();
  const hasMinterRole = await token.hasRole(MINTER_ROLE, signer.address);
  
  if (!hasMinterRole) {
    console.error("Signer does not have MINTER_ROLE");
    process.exit(1);
  }
  
  // Check if mint would exceed max supply
  const currentSupply = await token.totalSupply();
  const maxSupply = await token.maxSupply();
  
  if (currentSupply + mintAmount > maxSupply) {
    console.error("Mint would exceed max supply");
    console.error("Current supply:", ethers.formatEther(currentSupply));
    console.error("Requested mint:", amount);
    console.error("Max supply:", ethers.formatEther(maxSupply));
    process.exit(1);
  }
  
  const tx = await token.mint(recipient, mintAmount);
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("Tokens minted successfully");
  
  console.log("New total supply:", ethers.formatEther(await token.totalSupply()));
  console.log("Recipient balance:", ethers.formatEther(await token.balanceOf(recipient)));
}

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS || "";
  const recipient = process.env.RECIPIENT || "";
  const amount = process.env.AMOUNT || "";
  
  if (!tokenAddress || !recipient || !amount) {
    console.error("Please set TOKEN_ADDRESS, RECIPIENT, and AMOUNT environment variables");
    console.error("Example: AMOUNT=1000 (for 1000 tokens)");
    process.exit(1);
  }
  
  await mintTokens(tokenAddress, recipient, amount);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { mintTokens };