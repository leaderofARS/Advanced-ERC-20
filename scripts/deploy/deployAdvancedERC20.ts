import { ethers } from "hardhat";
import { AnalyticsHooks } from "../../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying AdvancedERC20 with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Token parameters
  const name = "Advanced ERC20 Token";
  const symbol = "AERC20";
  const decimals = 18;
  const maxSupply = ethers.parseEther("1000000"); // 1M tokens
  const transferFee = 100; // 1% fee in basis points
  const treasury = deployer.address; // Use deployer as treasury for now
  const burnRate = 50; // 50% of fees burned
  const transferLimit = ethers.parseEther("10000"); // 10K token transfer limit

  // Deploy the contract
  const AdvancedERC20Factory = await ethers.getContractFactory("AnalyticsHooks");
  const token = await AdvancedERC20Factory.deploy(
    name,
    symbol,
    decimals,
    maxSupply,
    transferFee,
    treasury,
    burnRate,
    transferLimit
  ) as AnalyticsHooks;

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("AdvancedERC20 deployed to:", tokenAddress);
  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());
  console.log("Max supply:", ethers.formatEther(await token.maxSupply()));
  console.log("Transfer fee:", await token.transferFee(), "basis points");

  // Mint initial supply to deployer
  const initialMint = ethers.parseEther("100000"); // 100K tokens
  await token.mint(deployer.address, initialMint);
  console.log("Minted", ethers.formatEther(initialMint), "tokens to deployer");

  return {
    token,
    tokenAddress,
    deployer: deployer.address
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;