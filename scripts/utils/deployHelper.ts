import { ethers } from "hardhat";
import { GasReporter } from "./gasReporter";

interface DeploymentConfig {
  name: string;
  symbol: string;
  decimals: number;
  maxSupply: string;
  transferFee: number;
  treasury: string;
  burnRate: number;
  transferLimit: string;
}

interface NetworkConfig {
  gasPrice?: string;
  gasLimit?: number;
  confirmations?: number;
}

class DeployHelper {
  private gasReporter: GasReporter;
  private networkConfig: NetworkConfig;

  constructor(networkConfig: NetworkConfig = {}) {
    this.gasReporter = new GasReporter();
    this.networkConfig = networkConfig;
  }

  async deployToken(config: DeploymentConfig) {
    console.log("🚀 Starting Advanced ERC20 deployment...");
    console.log("Configuration:", config);

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

    // Deploy contract
    const AdvancedERC20Factory = await ethers.getContractFactory("AnalyticsHooks");
    
    const deployTx = AdvancedERC20Factory.deploy(
      config.name,
      config.symbol,
      config.decimals,
      ethers.parseEther(config.maxSupply),
      config.transferFee,
      config.treasury,
      config.burnRate,
      ethers.parseEther(config.transferLimit)
    );

    const token = await this.gasReporter.recordTransaction("Deploy Contract", deployTx);
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log("✅ Contract deployed to:", tokenAddress);

    return {
      token,
      address: tokenAddress,
      deployer: deployer.address,
      gasReports: this.gasReporter.getReports()
    };
  }

  async setupInitialRoles(token: any, addresses: { [role: string]: string[] }) {
    console.log("🔐 Setting up initial roles...");

    for (const [roleName, addressList] of Object.entries(addresses)) {
      const roleBytes = await token[roleName]();
      
      for (const address of addressList) {
        const tx = token.grantRole(roleBytes, address);
        await this.gasReporter.recordTransaction(`Grant ${roleName}`, tx);
        console.log(`✅ Granted ${roleName} to ${address}`);
      }
    }
  }

  async mintInitialSupply(token: any, recipients: { address: string; amount: string }[]) {
    console.log("🪙 Minting initial supply...");

    for (const recipient of recipients) {
      const amount = ethers.parseEther(recipient.amount);
      const tx = token.mint(recipient.address, amount);
      await this.gasReporter.recordTransaction(`Mint ${recipient.amount}`, tx);
      console.log(`✅ Minted ${recipient.amount} tokens to ${recipient.address}`);
    }
  }

  async verifyDeployment(token: any, config: DeploymentConfig) {
    console.log("🔍 Verifying deployment...");

    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const maxSupply = await token.maxSupply();
    const transferFee = await token.transferFee();

    console.log("Verification Results:");
    console.log(`Name: ${name} (expected: ${config.name})`);
    console.log(`Symbol: ${symbol} (expected: ${config.symbol})`);
    console.log(`Decimals: ${decimals} (expected: ${config.decimals})`);
    console.log(`Max Supply: ${ethers.formatEther(maxSupply)} (expected: ${config.maxSupply})`);
    console.log(`Transfer Fee: ${transferFee} (expected: ${config.transferFee})`);

    const isValid = 
      name === config.name &&
      symbol === config.symbol &&
      decimals === config.decimals &&
      ethers.formatEther(maxSupply) === config.maxSupply &&
      transferFee === config.transferFee;

    if (isValid) {
      console.log("✅ Deployment verification passed");
    } else {
      console.log("❌ Deployment verification failed");
    }

    return isValid;
  }

  printGasSummary() {
    this.gasReporter.printSummary();
  }

  getGasReports() {
    return this.gasReporter.getReports();
  }
}

export { DeployHelper, DeploymentConfig, NetworkConfig };